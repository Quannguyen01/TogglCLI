import { IConfigManager } from './interface/IConfigManager';
import { ReportTimeEntry } from './model/ReportAPI/ReportTimeEntry';
import { IClientAPI } from './interface/IClientAPI';
import { Project } from './model/TogglAPI/Project';

export class TogglFacade {
    private client: IClientAPI;
    private configManager: IConfigManager;

    constructor(configManager: IConfigManager, client: IClientAPI) {
        this.configManager = configManager;
        this.client = client
        
        const apiKey = configManager.getValue('API_KEY');
        client.setApiKey(apiKey);
    }

    async start(taskName: string, projectName: string) {
        const pid = await this.findProjectId(projectName);

        if (pid) {
            const result = await this.client.startEntry({
                description: taskName,
                pid,
                created_with: 'my-toggl-client',
            });

            if (result) {
                return result;
            }
        }

        return {
            id: null,
            pid: null,
            description: null,
        };
    }

    async stop() {
        const currentTask = await this.client.getCurrent();

        if (currentTask && currentTask.id) {
            const stopTask = await this.client.stopEntry(currentTask.id);
            if (stopTask) {
                return stopTask.duration;
            }
        }

        return 0;
    }

    async current() {
        const MILISECOND = 1000;
        const currentTask = await this.client.getCurrent();

        if (currentTask && currentTask.at && currentTask.start) {
            const duration = ((new Date()).getTime() - (new Date(currentTask.start)).getTime()) / MILISECOND;
            return {
                description: currentTask.description,
                duration,
            };
        } else {
            return {
                description: null,
                duration: null,
            };
        }
    }

    async setApiKey(key: string) {
        this.configManager.setValue('API_KEY', key);
        await this.restartClient(key);
    }

    async setWorkspace(workspaceName: string) {
        const workspaces = await this.getWorkspaces();
        const workspace = workspaces.find((w) => w.name === workspaceName);

        if (workspace) {
            this.configManager.setValue('WORKSPACE_ID', workspace.id);
            await this.restartClient(this.configManager.getValue('API_KEY'));
            return true;
        }

        return false;
    }

    async getCurrentWorkspace() {
        const workspaces = await this.getWorkspaces();
        const currentWorkspace = workspaces.find((w) => w.isCurrent);

        if (currentWorkspace) {
            return currentWorkspace;
        } else {
            return null;
        }
    }

    async getWorkspaces() {
        const workspaces = await this.client.getWorkspaces();

        if (workspaces && workspaces.length > 0) {
            return workspaces.map((w) => {
                return {
                    id: w.id,
                    name: w.name,
                    isCurrent: w.id === parseInt(this.configManager.getValue('WORKSPACE_ID')),
                };
            });
        } else {
            return [];
        }
    }

    async getEntriesForDay(date: Date) {
        const workspaceId = parseInt(this.configManager.getValue('WORKSPACE_ID'));
        let entries: ReportTimeEntry[] = [];
        let page = 1;
        let reportDetails = await this.client.getDetailReport(workspaceId, date, date, page);

        while (reportDetails && reportDetails.data.length > 0) {
            entries = entries.concat(reportDetails.data);
            page++;
            reportDetails = await this.client.getDetailReport(workspaceId, date, date, page);
        }

        return entries;
    }

    async findProjectId(projectName: string) {
        const workspaceId = parseInt(this.configManager.getValue('WORKSPACE_ID'));
        const projects = await this.client.getWorkspaceProjects(workspaceId);
        if (projects) {
            const proj = projects.find((p) => p.name === projectName) as Project;
            if (proj) {
                return proj.id;
            }
        }
        return null;
    }

    async deleteEntry(timeEntryId: number) {
        const result = await this.client.deleteEntry(timeEntryId);
        return result.status === 200;
    }

    async getProjects() {
        const workspaceId = parseInt(this.configManager.getValue('WORKSPACE_ID'));
        const projects = await this.client.getWorkspaceProjects(workspaceId);
        return projects ? projects : [];
    }

    private async restartClient(apiKey = '') {
        await this.stop();
        this.client.setApiKey(apiKey);
    }
}

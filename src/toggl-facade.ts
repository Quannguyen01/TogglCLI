import { TogglClientApi } from './toggl-client';
import { IConfigManager } from './interface/IConfigManager';

export class TogglFacade {
    private client: TogglClientApi;
    private configManager: IConfigManager;

    constructor(configManager: IConfigManager) {
        this.configManager = configManager;
        const apiKey = configManager.getValue('API_KEY');
        const workspaceID = configManager.getValue('WORKSPACE_ID');
        this.client = new TogglClientApi(apiKey, workspaceID);
    }

    async start(taskName: string, projectName: string) {
        const pid = await this.client.findProjectId(projectName);

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
        await this.restartClient(key, this.configManager.getValue('WORKSPACE_ID'));
    }

    async setWorkspace(workspaceName: string) {
        const workspaces = await this.getWorkspaces();
        const workspace = workspaces.find((w) => w.name === workspaceName);

        if (workspace) {
            this.configManager.setValue('WORKSPACE_ID', workspace.id);
            await this.restartClient(this.configManager.getValue('API_KEY'), workspace.id);
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

    private async restartClient(apiKey = '', workspaceID = 0) {
        await this.stop();
        this.client = new TogglClientApi(apiKey, workspaceID);
    }
}

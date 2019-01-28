import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TimeEntry } from './model/TimeEntry';
import { Project } from './model/Project';
import { IClientAPI } from './interface/IClientAPI';
import { IConfigManager } from './interface/IConfigManager';

export class TogglClientApi implements IClientAPI {
    private configManager: IConfigManager;

    constructor(configManager: IConfigManager) {
        this.configManager = configManager;
    }

    async createEntry(entry: TimeEntry) {
        try {
            const result = await this.createRequest().post('/time_entries', {time_entry: entry});
            return this.extractData<TimeEntry>(result);
        } catch (err) {
            this.publishError(err);
            return {
                pid: null,
                description: null,
            };
        }

    }

    async startEntry(entry: TimeEntry) {
        try {
            const result = await this.createRequest().post('/time_entries/start', {time_entry: entry});
            return this.extractData<TimeEntry>(result);
        } catch (err) {
            this.publishError(err);
            return null;
        }
    }

    async findProjectId(projectName: string) {
        try {
            const workspaceId = this.configManager.getValue('WORKSPACE_ID');
            const response = await this.createRequest().get(`/workspaces/${workspaceId}/projects`);
            const projects = this.extractDataArray<Project>(response);
            if (projects) {
                const proj = projects.find((p) => p.name === projectName) as Project;
                if (proj) {
                    return proj.id;
                } else {
                    throw new Error('Project not found!');
                }
            }
            throw new Error('Namespace not found');
        } catch (err) {
            this.publishError(err);
            return null;
        }
    }

    async getCurrent() {
        try {
            const response = await this.createRequest().get('/time_entries/current');
            return this.extractData<TimeEntry>(response);
        } catch (err) {
            this.publishError(err);
            return null;
        }
    }

    async stopEntry(timeEntryId: number) {
        try {
            const response = await this.createRequest().put(`/time_entries/${timeEntryId}/stop`);
            return this.extractData<TimeEntry>(response);
        } catch (err) {
            this.publishError(err);
            return null;
        }
    }

    private extractDataArray<T>(result: AxiosResponse) {
        return result.data as T[];
    }

    private extractData<T>(result: AxiosResponse) {
        return result.data.data as T;
    }

    private publishError(error: any) {
        if (error.response) {
            console.log(`${error.response.status}-${error.response.statusText}`);
        } else if (error instanceof Error) {
            console.log(`${error.message}`);
        }
    }

    private createRequest() : AxiosInstance {
        const apiKey = this.configManager.getValue('API_KEY') as string;

        if (apiKey) {
            return Axios.create({
                baseURL: 'https://www.toggl.com/api/v8',
                headers: {
                    'Content-Type': 'application-json',
                },
                auth: {
                    username: apiKey,
                    password: 'api_token',
                },
            });
        } else {
            throw new Error('No API Key specified')
        }
    }
}

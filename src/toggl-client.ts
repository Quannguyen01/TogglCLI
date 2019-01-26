import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TimeEntry } from './model/TimeEntry';
import { Project } from './model/Project';
import { IClientAPI } from './interface/IClientAPI';
import { IConfigManager } from './interface/IConfigManager';

const WORKSPACE_ID = 2513188;

export class TogglClientApi implements IClientAPI {
    private apiKey: string;
    private request: AxiosInstance;
    private configManager: IConfigManager;

    constructor(configManager: IConfigManager) {
        this.configManager = configManager;
        this.apiKey = this.configManager.getValue('API_KEY') as string;
        this.request = Axios.create({
            baseURL: 'https://www.toggl.com/api/v8',
            headers: {
                'Content-Type': 'application-json',
            },
            auth: {
                username: this.apiKey,
                password: 'api_token',
            },
        });
    }

    async createEntry(entry: TimeEntry) {
        try {
            const result = await this.request.post('/time_entries', {time_entry: entry});
            return this.extractData<TimeEntry>(result);
        } catch (err) {
            console.log(`${err.status}-${err.statusText}`);
            return {
                pid: null,
                description: null,
            };
        }

    }

    async startEntry(entry: TimeEntry) {
        try {
            const result = await this.request.post('/time_entries/start', {time_entry: entry});
            return this.extractData<TimeEntry>(result);
        } catch (err) {
            this.publishError(err);
            return null;
        }
    }

    async findProjectId(projectName: string) {
        try {
            const response = await this.request.get(`/workspaces/${WORKSPACE_ID}/projects`);
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
            const response = await this.request.get('/time_entries/current');
            return this.extractData<TimeEntry>(response);
        } catch (err) {
            this.publishError(err);
            return null;
        }
    }

    async stopEntry(timeEntryId: number) {
        try {
            const response = await this.request.put(`/time_entries/${timeEntryId}/stop`);
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
}

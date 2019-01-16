import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TimeEntry } from './model/TimeEntry';
import { Project } from './model/Project';

const WORKSPACE_ID = 2513188;

export class TogglClientApi {
    private apiKey: string;
    private request: AxiosInstance;

    constructor() {
        this.apiKey = process.env['API_KEY'] as string;
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

    async start(taskName: string, projectName: string) {
        try {
            const pid = await this.findProjectId(projectName);

            if (pid) {
                const entry = {
                    description: taskName,
                    pid: pid,
                    created_with: 'my-toggl-client',
                };
                return await this.startEntry(entry);
            }
            throw new Error('Cannnot start a new task');
        } catch (err) {
            this.publishError(err);
            return {
                pid: null,
                description: null,
            };
        }
    }

    private async startEntry(entry: TimeEntry) {
        const result = await this.request.post('/time_entries/start', {time_entry: entry});
        return this.extractData<TimeEntry>(result);
    }

    async findProjectId(projectName: string) {
        try {
            const response = await this.request.get(`/workspaces/${WORKSPACE_ID}/projects`);
            const projects = this.extractDataArray<Project>(response);
            const t = projects.find(p => p.name == 'Toggl CLI');
            if (projects) {
                const project = projects.find(project => project.name == projectName) as Project
                if (project) {
                    return project.id;
                }
                else {
                    throw new Error('Project not found!');
                }
            }
            throw new Error('Namespace not found');
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
        if (<AxiosResponse>error.response != undefined)
            console.log(`${error.status}-${error.statusText}`)
        else if (error instanceof Error) {
            console.log(`${error.message}`)
        }
    }
}

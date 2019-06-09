import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TimeEntry } from './model/TogglAPI/TimeEntry';
import { Project } from './model/TogglAPI/Project';
import { IClientAPI } from './interface/IClientAPI';
import { Workspace } from './model/TogglAPI/Workspace';
import { ReportDetail } from './model/ReportAPI/ReportDetail';

export class TogglClientApi implements IClientAPI {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async createEntry(entry: TimeEntry) {
        try {
            const result = await this.createRequest().post('/time_entries', {time_entry: entry});
            return this.extractData<TimeEntry>(result);
        } catch (err) {
            this.publishError(err);
            return {
                id: null,
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

    async getWorkspaceProjects(workspaceId: number) {
        try {
            const response = await this.createRequest().get(`/workspaces/${workspaceId}/projects`);
            return this.extractDataArray<Project>(response);
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

    async getWorkspaces() {
        try {
            const response = await this.createRequest().get('/workspaces');
            return this.extractDataArray<Workspace>(response);
        } catch (err) {
            this.publishError(err);
            return [] as Workspace[];
        }
    }

    async getDetailReport(workspaceId: number, since: Date, until: Date, page = 1) {
        try {
            const request = this.createRequest(
                {
                    workspace_id: workspaceId,
                    since: since.toLocaleDateString(),
                    until: until.toLocaleDateString(),
                    page,
                    user_agent: 'my-toggl-client',
                }, true);

            const response = await request.get('/details');
            return this.extractReportData<ReportDetail>(response);
        } catch (err) {
            this.publishError(err);
            return null;
        }
    }

    async deleteEntry(timeEntryId: number) {
        try {
            return await this.createRequest().delete(`/time_entries/${timeEntryId}`);
        } catch (err) {
            this.publishError(err);
            return err.response;
        }
    }

    private extractReportData<T>(result: AxiosResponse) {
        return result.data as T;
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

    private createRequest(params?: object, reportAPI = false): AxiosInstance {
        const apiKey = this.apiKey;

        if (apiKey) {
            return Axios.create({
                baseURL: reportAPI ? 'https://www.toggl.com/reports/api/v2' : 'https://www.toggl.com/api/v8',
                headers: {
                    'Content-Type': 'application-json',
                },
                auth: {
                    username: apiKey,
                    password: 'api_token',
                },
                params,
            });
        } else {
            throw new Error('No API key specified');
        }
    }
}

import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TimeEntry } from './model/TimeEntry';

export class TogglClientApi {
    private apiKey: string;
    private request: AxiosInstance;

    constructor() {
        this.apiKey = <string>process.env['API_KEY'];
        this.request = Axios.create({
            baseURL: 'https://www.toggl.com/api/v8',
            headers: {
                'Content-Type': 'application-json' 
            },
            auth: {
                username: this.apiKey,
                password: 'api_token'
            }
        });
    }

    async createEntry(entry: TimeEntry) {
        try {
            let result = await this.request.post('/time_entries', {"time_entry": entry})
            return this.extractEntry(result);
        }
        catch(err) {
            console.log(err.data);
            return {
                pid: null,
                description: null
            };
        }

    }

    async start(taskName: string) {
        try {
            let entry = {
                description: taskName,
                pid: 148757817,
                created_with: "my-toggl-client"
            };
            let result = await this.request.post('/time_entries/start', {"time_entry": entry});
            return this.extractEntry(result);
        } catch (err) {
            console.log(err.data);
            return {
                pid: null,
                description: null
            };
        }
    }

    private extractEntry(result: AxiosResponse): TimeEntry {
        return result.data.data;
    }
}
import { IClientAPI } from '../../src/interface/IClientAPI';
import { TimeEntry } from '../../src/model/TogglAPI/TimeEntry';
import { Project } from '../../src/model/TogglAPI/Project';
import { Workspace } from '../../src/model/TogglAPI/Workspace';
import { ReportDetail } from '../../src/model/ReportAPI/ReportDetail';

export class FakeClientApi implements IClientAPI {
    private currentEntry: TimeEntry;
    private apiKey: string;

    constructor() {
        this.currentEntry = {
            id: 1,
            description: 'testing task',
            created_with: 'testing',
        };
        this.apiKey = '';
    }

    setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    async createEntry(entry: TimeEntry): Promise<any> {
        this.currentEntry = entry;
        this.currentEntry.id = 1;
        return this.currentEntry;
    }

    async startEntry(entry: TimeEntry): Promise<TimeEntry> {
        this.currentEntry = entry;
        this.currentEntry.id = 1;
        return this.currentEntry;
    }

    async getWorkspaceProjects(workspaceId: number): Promise<Project[]> {
        return [
            {
                id: 1,
                pid: 1,
                wid: 1,
                name: 'Toggl CLI',
            },
        ];
    }

    async getCurrent(): Promise<TimeEntry> {
        return this.currentEntry;
    }

    async stopEntry(timeEntryId: number): Promise<TimeEntry> {
        this.currentEntry.duration = 200;
        return this.currentEntry;
    }

    async getWorkspaces(): Promise<Workspace[]> {
        return [
            {
                id: 1,
                name: 'Workplace 2',
                premium: false,
                admin: false,
            },
            {
                id: 2,
                name: 'Toggl CLI Test',
                premium: false,
                admin: false,
            },
        ];
    }

    async getDetailReport(workspaceId: number, since: Date, until: Date, page: number): Promise<ReportDetail> {
        if (page === 1) {
            return {
                total_grand: 1000,
                total_count: 2,
                per_page: 2,
                data: [
                    {
                        uid: 1,
                        description: 'Test adding new facade entry',
                        use_stop: false,
                    },
                    {
                        uid: 2,
                        description: 'Testing',
                        use_stop: false,
                    },
                ],
            };
        } else {
            return {
                total_grand: 1000,
                total_count: 2,
                per_page: 2,
                data: [],
            };
        }
    }

    async deleteEntry(entryID: number): Promise<any> {
        return {
            status: 200,
        };
    }
}

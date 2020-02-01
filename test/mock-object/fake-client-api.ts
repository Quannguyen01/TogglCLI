import { IClientAPI } from '../../src/interface/IClientAPI';
import { TimeEntry } from '../../src/model/TogglAPI/TimeEntry';
import { Project } from '../../src/model/TogglAPI/Project';
import { Workspace } from '../../src/model/TogglAPI/Workspace';
import { ReportDetail } from '../../src/model/ReportAPI/ReportDetail';

export class FakeClientApi implements IClientAPI
{
    setApiKey(apiKey: string): void {
        return;
    }    
    
    async createEntry(entry: TimeEntry): Promise<any> {
        entry.id = 1;
        return entry;
    }

    startEntry(entry: TimeEntry): Promise<TimeEntry> {
        throw new Error("Method not implemented.");
    }

    async getWorkspaceProjects(workspaceId: number): Promise<Project[]> {
        return [
            {
                id: 1,
                pid: 1,
                wid: 1,
                name: "Toggl CLI"
            }
        ]
    }

    getCurrent(): Promise<TimeEntry> {
        throw new Error("Method not implemented.");
    }
    stopEntry(timeEntryId: number): Promise<TimeEntry> {

    }
    getWorkspaces(): Promise<Workspace[]> {
        throw new Error("Method not implemented.");
    }
    getDetailReport(workspaceId: number, since: Date, until: Date, page: number): Promise<ReportDetail> {
        throw new Error("Method not implemented.");
    }
    deleteEntry(entryID: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
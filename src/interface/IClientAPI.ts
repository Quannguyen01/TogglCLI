import { TimeEntry } from '../model/TogglAPI/TimeEntry';
import { Workspace } from '../model/TogglAPI/Workspace';
import { ReportDetail } from '../model/ReportAPI/ReportDetail';

export interface IClientAPI {
    createEntry(entry: TimeEntry): Promise<any>;
    startEntry(entry: TimeEntry): Promise<TimeEntry | null>;
    findProjectId(projectName: string): Promise<number | null | undefined>;
    getCurrent(): Promise<TimeEntry | null>;
    stopEntry(timeEntryId: number): Promise<TimeEntry | null>;
    getWorkspaces(): Promise<Workspace[]>;
    getDetailReport(workspaceId: number, since: Date, until: Date, page: number): Promise<ReportDetail | null>;
}

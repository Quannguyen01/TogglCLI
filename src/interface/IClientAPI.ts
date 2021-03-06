import TimeEntry from '../model/TogglAPI/TimeEntry';
import Workspace from '../model/TogglAPI/Workspace';
import ReportDetail from '../model/ReportAPI/ReportDetail';
import Project from '../model/TogglAPI/Project';

export default interface IClientAPI {
    setApiKey(apiKey: string): void;
    createEntry(entry: TimeEntry): Promise<any>;
    startEntry(entry: TimeEntry): Promise<TimeEntry | null>;
    getWorkspaceProjects(workspaceId: number): Promise<Project[] | null>;
    getCurrent(): Promise<TimeEntry | null>;
    stopEntry(timeEntryId: number): Promise<TimeEntry | null>;
    getWorkspaces(): Promise<Workspace[]>;
    getDetailReport(workspaceId: number, since: Date, until: Date, page: number): Promise<ReportDetail | null>;
    deleteEntry(entryID: number): Promise<any>;
}

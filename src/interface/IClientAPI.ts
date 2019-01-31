import { TimeEntry } from '../model/TimeEntry';
import { Workspace } from '../model/Workspace';

export interface IClientAPI {
    createEntry(entry: TimeEntry): Promise<any>;
    startEntry(entry: TimeEntry): Promise<TimeEntry | null>;
    findProjectId(projectName: string): Promise<number | null | undefined>;
    getCurrent(): Promise<TimeEntry | null>;
    stopEntry(timeEntryId: number): Promise<TimeEntry | null>;
    getWorkspaces(): Promise<Workspace[]>;
}

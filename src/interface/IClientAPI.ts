import { TimeEntry } from "../model/TimeEntry";

export interface IClientAPI {
    createEntry(entry: TimeEntry): Promise<any>;
    startEntry(entry: TimeEntry): Promise<TimeEntry | null>;
    findProjectId(projectName: string): Promise<number | null | undefined>;
    getCurrent(): Promise<TimeEntry | null>;
    stopEntry(timeEntryId: number): Promise<TimeEntry | null>;
}

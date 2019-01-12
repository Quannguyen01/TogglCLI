export interface TimeEntry {
    id?: number;
    description: string;
    wid?: number;
    pid?: number;
    tid?: number;
    billable?: boolean;
    start: Date;
    stop?: Date;
    duration: number;
    created_with: string;
    tags?: string[];
    duronly?: boolean;
    at?: Date;
    uid?: number;
}

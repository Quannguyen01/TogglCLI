export default interface ReportTimeEntry {
    id?: number;
    wid?: number;
    pid?: number;
    tid?: number;
    uid: number;
    description: string;
    start?: Date;
    end?: Date;
    updated?: Date;
    dur?: number;
    user?: string;
    use_stop: boolean;
    client?: string;
    task?: string;
    project?: string;
    duronly?: boolean;
    billable?: number;
    tags?: string[];
}

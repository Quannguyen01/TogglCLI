export interface Project {
    id?: number;
    pid?: number;
    name: string;
    wid: number;
    cid?: number;
    active?: boolean;
    is_private?: boolean;
    template?: boolean;
    template_id?: number;
    billabe?: boolean;
    auto_estimates?: boolean;
    esitmated_hours?: number;
    at?: number;
    color?: number;
    rate?: number;
}
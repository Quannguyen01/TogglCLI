import ReportTimeEntry from './ReportTimeEntry';

export default interface ReportDetail {
    total_grand: number;
    total_billabe?: number;
    total_count: number;
    per_page: number;
    data: ReportTimeEntry[];
}

export interface Workspace {
    id?: number,
    name: string,
    premium: boolean,
    admin: boolean,
    default_hourly_rate?: number,
    default_currency?: string,
    only_admins_may_create_objects?: boolean,
    only_admins_see_billable_rates?: boolean,
    rounding?: number,
    rounding_minutes?: number,
    at?: Date,
    logo_url?: string
}

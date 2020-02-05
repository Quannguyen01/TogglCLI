import ReportTimeEntry from './model/ReportAPI/ReportTimeEntry';
import { arrayZipWith } from './list-functional';
import Project from './model/TogglAPI/Project';
import ILog from './interface/ILog';

function padZeroes(num: any, numZero: number) {
    return num.toString().padStart(numZero, '0');
}

export function padEndSpace(str: string, numSpace: number) {
    return (str.length > numSpace) ?
        str.substr(0, numSpace) :
        str.padEnd(numSpace, ' ');
}

export function makePrettyTimeDuration(durationInSec: number) {
    const MINUTE = 60;
    const HOUR = 60;
    const DAY = 24;

    const secDisplay = padZeroes(Math.trunc(durationInSec % MINUTE), 2);
    const minutes = Math.trunc(durationInSec / MINUTE);
    const minDisplay = padZeroes(minutes % HOUR, 2);
    const hours = Math.trunc(minutes / HOUR);

    const hourDisplay = padZeroes(hours % DAY, 2);
    const dayDisplay = Math.trunc(hours / DAY);

    return (dayDisplay > 0 ? `${dayDisplay} days - ` : '') +
        `${hourDisplay}:${minDisplay}:${secDisplay}`;
}

export function getDatePortion(date: Date) {
    return `${date.getFullYear()}-${padZeroes(date.getMonth() + 1, 2)}-${padZeroes(date.getDate(), 2)}`;
}

export function getTimePortion(date: Date) {
    const [hour, minute, second] =
        [date.getHours(), date.getMinutes(), date.getSeconds()].map((a) => padZeroes(a, 2));

    return `${hour}:${minute}:${second}`;
}

export function toStringEntry(entry: ReportTimeEntry): string {
    const entryOutput = [
        entry.id ? entry.id.toString() : '',
        entry.description,
        entry.project || '',
        entry.start ? getTimePortion(new Date(entry.start)) : '',
        entry.end ? getTimePortion(new Date(entry.end)) : '',
        entry.dur ? makePrettyTimeDuration(entry.dur / 1000) : '00:00:00',
    ];

    return arrayZipWith(padEndSpace, entryOutput, [12, 40, 20, 12, 12, 12]).join(' | ');
}

export function toStringProject(project: Project): string {
    const projectOutput = [
        project.name,
        project.active ? 'active' : 'inactive',
    ];

    return arrayZipWith(padEndSpace, projectOutput, [30, 10]).join(' | ');
}

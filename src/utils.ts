function padZero(number: any, numZero: number) {
    return number.toString().padStart(numZero, '0');
}

export function makePrettyTimeDuration(durationInSec: number) {
    const MINUTE = 60;
    const HOUR = 60;
    const DAY = 24;

    const secDisplay = padZero(Math.trunc(durationInSec % MINUTE), 2);
    const minutes = Math.trunc(durationInSec / MINUTE);
    const minDisplay = padZero(minutes % HOUR, 2)
    const hours = Math.trunc(minutes / HOUR);

    const hourDisplay = padZero(hours % DAY, 2);
    const dayDisplay = Math.trunc(hours / DAY);

    return (dayDisplay > 0 ? `${dayDisplay} days - ` : '') +
        `${hourDisplay}:${minDisplay}:${secDisplay}`;
}

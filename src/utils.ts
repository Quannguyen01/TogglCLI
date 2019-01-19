export function makePrettyTimeDuration(durationInSec: number) {
    const MINUTE = 60;
    const HOUR = 60;
    const DAY = 24;

    const secDisplay = durationInSec % MINUTE;
    const minutes = Math.round(durationInSec / MINUTE);
    const minDisplay = minutes % HOUR;
    const hours = Math.round(minutes / HOUR);

    const hourDisplay = hours % DAY;
    const dayDisplay = Math.round(hours / DAY);

    return (dayDisplay > 0 ? `${dayDisplay} days - ` : '') +
        `${hourDisplay}:${minDisplay}:${secDisplay}`;
}

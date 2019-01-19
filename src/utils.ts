export function makePrettyTimeDuration(durationInSec: number) {
    const MINUTE = 60,
        HOUR = 60,
        DAY = 24;
    
    let secDisplay, minDisplay, hourDisplay, dayDisplay: number;

    secDisplay = durationInSec % MINUTE;
    let minutes = Math.round(durationInSec / MINUTE);
    
    minDisplay = minutes % HOUR;
    let hours = Math.round(minutes / HOUR);

    hourDisplay = hours % DAY;
    dayDisplay = Math.round(hours / DAY);

    return (dayDisplay > 0 ? `${dayDisplay} days - ` : '') +
        `${hourDisplay}:${minDisplay}:${secDisplay}`;
}
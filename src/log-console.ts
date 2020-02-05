import ILog from "./interface/ILog";

export default class LogConsole implements ILog {
    publish(message: string): void {
        console.log(message);
    }
}
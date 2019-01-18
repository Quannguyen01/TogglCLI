import { TogglClientApi } from './toggl-client';
import { TimeEntry } from './model/TimeEntry';

export class TogglFacade {
    private client: TogglClientApi;

    constructor() {
        this.client = new TogglClientApi()
    }

    async start(taskName: string, projectName: string) {
        try {
            const pid = await this.client.findProjectId(projectName);

            if (pid) {
                const result = await this.client.startEntry({
                    description: taskName,
                    pid: pid,
                    created_with: 'my-toggl-client',
                });

                if (!result)
                    throw new Error('Cannot start a new task');
                else {
                    return result;
                }
            }
            throw new Error('Cannnot start a new task');
        } catch (err) {
            console.log(err.message);
            return {
                pid: null,
                description: null,
            };
        }
    }

    async stop(): Promise<boolean> {
        try {
            const currentTask = await this.client.getCurrent();

            if (currentTask && currentTask.id) {
                const stopTask = await this.client.stopEntry(currentTask.id)
                if (stopTask) {
                    return true;
                } else {
                    throw new Error('Cannot stop current task');
                }
            } else {
                throw new Error('Cannot get current task');
            }
        } catch (err) {
            console.log(err.message);
            return false;
        }
    }
}
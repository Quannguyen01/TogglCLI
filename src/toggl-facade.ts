import { TogglClientApi } from './toggl-client';
import { IConfigManager } from './interface/IConfigManager';

export class TogglFacade {
    private client: TogglClientApi;
    private configManager: IConfigManager;

    constructor(configManager: IConfigManager) {
        this.client = new TogglClientApi(configManager);
        this.configManager = configManager;
    }

    async start(taskName: string, projectName: string) {
        try {
            const pid = await this.client.findProjectId(projectName);

            if (pid) {
                const result = await this.client.startEntry({
                    description: taskName,
                    pid,
                    created_with: 'my-toggl-client',
                });

                if (!result) {
                    throw new Error('Cannot start a new task');
                } else {
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

    async stop() {
        try {
            const currentTask = await this.client.getCurrent();

            if (currentTask && currentTask.id) {
                const stopTask = await this.client.stopEntry(currentTask.id);
                if (stopTask) {
                    return stopTask.duration;
                } else {
                    throw new Error('Cannot stop current task');
                }
            } else {
                throw new Error('Cannot get current task');
            }
        } catch (err) {
            console.log(err.message);
            return 0;
        }
    }

    async current() {
        try {
            const MILISECOND = 1000;
            const currentTask = await this.client.getCurrent();

            if (currentTask && currentTask.at && currentTask.start) {
                const duration = ((new Date()).getTime() - (new Date(currentTask.start)).getTime()) / MILISECOND;
                return {
                    description: currentTask.description,
                    duration,
                };
            } else {
                throw new Error('Cannot get current task');
            }
        } catch (err) {
            console.log(err.message);
            return {
                description: null,
                duration: null,
            };
        }
    }

    setApiKey(key: string) {
        this.configManager.setValue('API_KEY', key);
    }
}

import { Command } from 'commander';
import { TogglFacade } from './toggl-facade';
import { makePrettyTimeDuration } from './utils';
import { ConfigManager } from './config-manager';

const program = new Command();
const configManager = ConfigManager.initialize('test.yml');
const toggl = new TogglFacade(configManager);

program.version('0.0.1');

program
    .command('start <taskName>')
    .description('start a task')
    .option('-p, --project <projectName>', 'project for the task')
    .action(async (taskName, cmd) => {
        if (cmd.project) {
            const result = await toggl.start(taskName, cmd.project);
            if (result.description != null) {
                console.log(`Task ${taskName} has succesfully started!`);
            } else {
                console.log(`Task ${taskName} has failed to start.`);
            }
        } else {
            console.log('Please specified a project');
        }
    });

program
    .command('stop')
    .description('stop current task')
    .action(async () => {
        const result = await toggl.stop();
        if (result) {
            console.log(`Current task stopped succesfully!\nTask duration: ${makePrettyTimeDuration(result)}`);
        } else {
            console.log('Failed to stop task');
        }
    });

program
    .command('current')
    .description('get current running task')
    .action(async () => {
        const result = await toggl.current();
        if(result.description && result.duration) {
            console.log(`Current task: ${result.description}\nDuration: ${makePrettyTimeDuration(result.duration)}`);
        } else {
            console.log('Failed to get current');
        }
    })

program.parse(process.argv);

import { Command } from 'commander';
import { startUp } from './startup';
import { TogglFacade } from './toggl-facade';

startUp();

const program = new Command();
const toggl = new TogglFacade();

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
    .action(async() => {
        const result = await toggl.stop();
        if (result) {
            console.log('Current task stopped succesfully');
        } else {
            console.log('Failed to stop task');
        }
    });

program.parse(process.argv);

import { Command } from 'commander';
import { startUp } from './startup';
import { TogglClientApi } from './toggl';

startUp();

const program = new Command();
const togglClient = new TogglClientApi();

program.version('0.0.1');

program
    .command('start <taskName>')
    .description('start a task')
    .option('-p, --project <projectName>', 'project for the task')
    .action(async (taskName, cmd) => {
        if (cmd.project) {
            const result = await togglClient.start(taskName, cmd.project);
            if (result.description != null) {
                console.log(`Task ${taskName} has succesfully started!`);
            } else {
                console.log(`Task ${taskName} has failed to start.`);
            }
        } else {
            console.log('Please specified a project');
        }
    });

program.parse(process.argv);

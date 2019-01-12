import { Command } from 'commander';
import { startUp } from './startup';
import { TogglClientApi } from './toggl';

startUp();

let program = new Command();
let togglClient = new TogglClientApi();

program.version('0.0.1');

program
    .command('start <taskName>', 'start a task')
    .action(async (cmd, taskName) => {
        let result = await togglClient.start(taskName)
        if (result.description != null) {
            console.log(`Task ${taskName} has succesfully started!`)
        } else {
            console.log(`Task ${taskName} has failed to start.`)
        }

        process.exit(0);
    });

program.parse(process.argv);
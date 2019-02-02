import { Command } from 'commander';
import { TogglFacade } from './toggl-facade';
import { makePrettyTimeDuration } from './utils';
import { ConfigManager } from './config-manager';

const program = new Command();
const configManager = ConfigManager.initialize('config.yml');
const toggl = new TogglFacade(configManager);

program.version('0.0.1');

program
    .command('start <taskName>')
    .description('Start a task')
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
    .description('Stop current task')
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
    .description('Get current running task')
    .action(async () => {
        const result = await toggl.current();
        if (result.description && result.duration) {
            console.log(`Current task: ${result.description}\nDuration: ${makePrettyTimeDuration(result.duration)}`);
        }
    });

program
    .command('auth_token <apiKey>')
    .description('Setup authorization key')
    .action((apiKey) => {
        toggl.setApiKey(apiKey);
    });

program
    .command('workspace [workspace]')
    .description('Setup active workspace to a specific. List available workspaces if no workspace is provided.')
    .action(async (workspace) => {
        if (workspace) {
            await toggl.setWorkspace(workspace);
        } else {
            const workspaces = await toggl.getWorkspaces();
            console.log('Available workspaces:');
            for (const workspace of workspaces) {
                let outString = `* ${workspace.name}` +
                        (workspace.isCurrent ? ' <-- current workspace' : '');
                console.log(outString);
            }
            console.log('Type workspace <workspace_id> if you want to swap workspace');
        }
    });

program.parse(process.argv);

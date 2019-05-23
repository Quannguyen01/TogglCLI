import { Command } from 'commander';
import { TogglFacade } from './toggl-facade';
import { makePrettyTimeDuration, getDatePortion, printEntry, padEndSpace } from './utils';
import { ConfigManager } from './config-manager';

const program = new Command();
const configManager = ConfigManager.initialize('config.yml');
const toggl = new TogglFacade(configManager);

program.version('0.1.0');

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
        } else {
            console.log('No current task is found!');
        }
    });

program
    .command('auth_token <apiKey>')
    .description('Setup authorization key')
    .action((apiKey) => {
        toggl.setApiKey(apiKey);
    });

program
    .command('workspace [workspaceName]')
    .description('Setup active workspace to a specific. List available workspaces if no workspace is provided.')
    .action(async (workspaceName) => {
        if (workspaceName) {
            if (!await toggl.setWorkspace(workspaceName)) {
                console.log(`Workspace ${workspaceName} not found`);
            } else {
                console.log(`Switched to ${workspaceName}.`);
            }
        } else {
            const workspaces = await toggl.getWorkspaces();
            console.log('Available workspaces:');
            for (const workspace of workspaces) {
                const outString = `* ${workspace.name}` +
                        (workspace.isCurrent ? ' <-- current workspace' : '');
                console.log(outString);
            }
            console.log('Type workspace <workspace_id> if you want to swap workspace');
        }
    });

program
    .command('entries')
    .description('List time entries entered today')
    .action(async () => {
        const date = getDatePortion(new Date());
        const entries = await toggl.getEntriesForDay(new Date(date));
        const header = `${padEndSpace('Entry', 40)} | ${padEndSpace('Project', 20)} | ` +
                        `${padEndSpace('Start', 12)} | ${padEndSpace('End', 12)} | ${padEndSpace('Duration', 12)}`;
        console.log(header);
        entries.forEach(printEntry);
    });

program.parse(process.argv);

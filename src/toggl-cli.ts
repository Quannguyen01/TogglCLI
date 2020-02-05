import { Command } from 'commander';
import TogglFacade from './toggl-facade';
import { makePrettyTimeDuration, getDatePortion, toStringEntry, padEndSpace, toStringProject } from './utils';
import ConfigManager from './config-manager';
import TogglClientApi from './toggl-client';
import LogConsole from './log-console';

const program = new Command();
const configManager = ConfigManager.initialize('config.yml');
const logger = new LogConsole();
const client = new TogglClientApi(logger);

const toggl = new TogglFacade(configManager, client);

program.version('0.2.1');

program
    .command('start <taskName>')
    .description('Start a task')
    .option('-p, --project <projectName>', 'project for the task')
    .action(async (taskName: string, cmd: any) => {
        if (cmd.project) {
            const result = await toggl.start(taskName, cmd.project);
            if (result.description != null) {
                logger.publish(`Task ${taskName} has succesfully started!`);
            } else {
                logger.publish(`Task ${taskName} has failed to start.`);
            }
        } else {
            logger.publish('Please specified a project');
        }
    });

program
    .command('stop')
    .description('Stop current task')
    .action(async () => {
        const result = await toggl.stop();
        if (result) {
            logger.publish(`Current task stopped succesfully!\nTask duration: ${makePrettyTimeDuration(result)}`);
        } else {
            logger.publish('Failed to stop task');
        }
    });

program
    .command('current')
    .description('Get current running task')
    .action(async () => {
        const result = await toggl.current();
        if (result.description && result.duration) {
            logger.publish(`Current task: ${result.description}\nDuration: ${makePrettyTimeDuration(result.duration)}`);
        } else {
            logger.publish('No current task is found!');
        }
    });

program
    .command('auth_token <apiKey>')
    .description('Setup authorization key')
    .action((apiKey: string) => {
        toggl.setApiKey(apiKey);
    });

program
    .command('workspace [workspaceName]')
    .description('Setup active workspace to a specific. List available workspaces if no workspace is provided.')
    .action(async (workspaceName: string) => {
        if (workspaceName) {
            if (!await toggl.setWorkspace(workspaceName)) {
                logger.publish(`Workspace ${workspaceName} not found`);
            } else {
                logger.publish(`Switched to ${workspaceName}.`);
            }
        } else {
            const workspaces = await toggl.getWorkspaces();
            logger.publish('Available workspaces:');
            for (const workspace of workspaces) {
                const outString = `* ${workspace.name}` +
                        (workspace.isCurrent ? ' <-- current workspace' : '');
                logger.publish(outString);
            }
            logger.publish('Type workspace <workspace_id> if you want to swap workspace');
        }
    });

program
    .command('entries')
    .description('List time entries entered today')
    .action(async () => {
        const date = getDatePortion(new Date());
        const entries = await toggl.getEntriesForDay(new Date(date));
        const header = `${padEndSpace('Entry ID', 12)} | ${padEndSpace('Entry', 40)} ` +
                        `| ${padEndSpace('Project', 20)} | ${padEndSpace('Start', 12)} | ${padEndSpace('End', 12)} ` +
                        `| ${padEndSpace('Duration', 12)}`;
        logger.publish(header);
        entries.forEach(entry => {
            logger.publish(toStringEntry(entry));
        });
    });

program
    .command('delete <timeEntryId>')
    .description('Delete a time entry')
    .action(async (timeEntryId: number) => {
        if (await toggl.deleteEntry(timeEntryId)) {
            logger.publish('Entry deleted successfully!');
        } else {
            logger.publish('Errors while deleting the entry.');
        }
    });

program
    .command('projects')
    .description('List all projects in available workspace')
    .action(async () => {
        const projects = await toggl.getProjects();
        projects.forEach(project => {
            logger.publish(toStringProject(project));
        });
    });

program.parse(process.argv);

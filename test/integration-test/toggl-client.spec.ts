import { TogglClientApi } from '../../src/toggl-client';
import { TimeEntry } from '../../src/model/TogglAPI/TimeEntry';
import { expect } from 'chai';
import { IConfigManager } from '../../src/interface/IConfigManager';
import { IClientAPI } from '../../src/interface/IClientAPI';
import { ConfigManager } from '../../src/config-manager';

export const togglCLientTest = describe('Toggl API Testing', function() {
    let toggl: IClientAPI;
    let config: IConfigManager;
    let workspaceID: number;
    const entriesToDelete: number[] = [];

    before(function() {
        config = ConfigManager.initialize('test.yml');
        const apiKey = config.getValue('API_KEY');
        workspaceID = config.getValue('WORKSPACE_ID');

        toggl = new TogglClientApi();
        toggl.setApiKey(apiKey);
    });

    it('should create a time entry using toggl client api', async function() {
        const entry: TimeEntry = {
            description: 'Meeting with possible client',
            tags: ['billed'],
            duration: 1200,
            start: new Date(),
            pid: parseInt(config.getValue('PROJECT_TEST_ID')) || 0,
            created_with: config.getValue('APP_NAME') || '',
        };

        const result = await toggl.createEntry(entry);
        expect(result.pid).to.not.be.null;
        expect(result).to.be.not.undefined;
        expect(result.description).to.equal(entry.description);

        if (result && result.id) {
            entriesToDelete.push(result.id);
        }
    });

    it('should start a time entry', async function() {
        const entry: TimeEntry = {
            description: 'Testing starting time entry from Toggl client',
            tags: ['dev'],
            pid: parseInt(config.getValue('PROJECT_TEST_ID')) || 0,
            created_with: config.getValue('APP_NAME') || '',
        };

        const result = await toggl.startEntry(entry);

        if (result) {
            expect(result.description).to.equal(entry.description);
            if (result.id) {
                entriesToDelete.push(result.id);
            }
        } else {
            expect.fail('Failed to start time entry');
        }
    });

    it('should get the current running entry from toggl', async function() {
        await toggl.startEntry({
            description: 'Testing adding new entry to get current',
            pid: parseInt(config.getValue('PROJECT_TEST_ID')) || 0,
            created_with: config.getValue('APP_NAME') || '',
        });

        const result = await toggl.getCurrent();

        if (result && result.id) {
            expect(result.description).to.equal('Testing adding new entry to get current');
            entriesToDelete.push(result.id);
        } else {
            expect.fail('Cannot get current task');
        }
    });

    it('should stop the current running entry in toggl', async function() {
        const runningEntry = await toggl.startEntry({
            description: 'Testing adding new entry to stop',
            pid: parseInt(config.getValue('PROJECT_TEST_ID'), 0),
            created_with: config.getValue('APP_NAME') || '',
        });

        const entryId = runningEntry && runningEntry.id ? runningEntry.id : -1;
        const result = await toggl.stopEntry(entryId);

        if (result && result.id) {
            expect(result.description).to.equal('Testing adding new entry to stop');
            expect(result.id).to.equal(entryId);
            entriesToDelete.push(result.id);
        } else {
            expect.fail('Failed to stop current entry');
        }
    });

    it('should display the available workspace', async function() {
        const workspaces = await toggl.getWorkspaces();
        expect(workspaces).to.not.empty;

        const currentWorkspace = parseInt(config.getValue('WORKSPACE_ID')) || 0;
        const workspaceIDs = workspaces.map((w) => w.id);
        expect(workspaceIDs).includes(currentWorkspace);
    });

    it('should get report detail for today for standard workspace', async function() {
        const fromDate = new Date();
        fromDate.setHours(0, 0, 0);
        const toDate = new Date();
        toDate.setHours(23, 59, 59);
        const page = 1;

        const details = await toggl.getDetailReport(workspaceID, fromDate, toDate, page);

        if (details != null) {
            const entries = details.data;
            expect(entries.find((entry) => entry.description === 'Testing adding new entry to get current'))
                .to.not.be.undefined;
        } else {
            expect.fail('details should not be null');
        }
    });

    it('should create an entry and delete it immediately', async function() {
        const entry: TimeEntry = {
            description: 'Testing delete',
            tags: ['dev'],
            pid: parseInt(config.getValue('PROJECT_TEST_ID')) || 0,
            created_with: config.getValue('APP_NAME') || '',
        };

        const createdResult = await toggl.startEntry(entry);

        if (createdResult) {
            const entryID = createdResult.id || 0;
            expect(entryID).not.equals(0);

            const result = await toggl.deleteEntry(entryID);
            expect(result.status).equals(200);
        }

    });

    it('should get all the projects from the current workspace', async function() {
        const projects = await toggl.getWorkspaceProjects(workspaceID);
        let found = false;
        if (projects == null) {
            expect.fail('result should not be null');
        } else {
            for (const project of projects) {
                if (project.name === 'Toggl CLI') {
                    found = true;
                    break;
                }
            }
        }
        expect(found).to.be.true;
    });

    after(async function() {
        entriesToDelete.forEach(async (entryId) => {
            await toggl.deleteEntry(entryId);
        });
    });
});

togglCLientTest.run();

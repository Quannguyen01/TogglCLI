import { TogglClientApi } from '../../src/toggl-client';
import { TimeEntry } from '../../src/model/TogglAPI/TimeEntry';
import { expect } from 'chai';
import { MockConfig } from '../mock_objects/mock-config';
import { IConfigManager } from '../../src/interface/IConfigManager';
import { IClientAPI } from '../../src/interface/IClientAPI';

describe('Toggl API Testing', function() {
    let toggl: IClientAPI;
    let mockConfig: IConfigManager;
    let workspaceID: number;
    const entriesToDelete: number[] = [];

    before(function() {
        mockConfig = new MockConfig();
        const apiKey = mockConfig.getValue('API_KEY');
        workspaceID = mockConfig.getValue('WORKSPACE_ID');
        toggl = new TogglClientApi(apiKey);
    });

    it('should create a time entry using toggl client api', async function() {
        const entry: TimeEntry = {
            description: 'Meeting with possible client',
            tags: ['billed'],
            duration: 1200,
            start: new Date('2013-03-05T07:58:58.000Z'),
            pid: parseInt(mockConfig.getValue('PROJECT_TEST_ID')) || 0,
            created_with: mockConfig.getValue('APP_NAME') || '',
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
            pid: parseInt(mockConfig.getValue('PROJECT_TEST_ID')) || 0,
            created_with: mockConfig.getValue('APP_NAME') || '',
        };

        const result = await toggl.startEntry(entry);

        if (result) {
            expect(result.description).to.equal(entry.description);
        } else {
            expect.fail('Failed to start time entry');
        }

        if (result && result.id) {
            entriesToDelete.push(result.id);
        }
    });

    it('should get the current running entry from toggl', async function() {
        await toggl.startEntry({
            description: 'Testing adding new entry to get current',
            pid: parseInt(mockConfig.getValue('PROJECT_TEST_ID')) || 0,
            created_with: mockConfig.getValue('APP_NAME') || '',
        });

        const result = await toggl.getCurrent();

        if (result) {
            expect(result.description).to.equal('Testing adding new entry to get current');
        } else {
            this.skip();
        }
    });

    it('should stop the current running entry in toggl', async function() {
        const runningEntry = await toggl.startEntry({
            description: 'Testing adding new entry to stop',
            pid: parseInt(mockConfig.getValue('PROJECT_TEST_ID'), 0),
            created_with: mockConfig.getValue('APP_NAME') || '',
        });

        const entryId = runningEntry && runningEntry.id ? runningEntry.id : -1;
        const result = await toggl.stopEntry(entryId);

        if (result) {
            expect(result.description).to.equal('Testing adding new entry to stop');
            expect(result.id).to.equal(entryId);
        } else {
            this.skip();
        }
    });

    it('should display the available workspace', async function() {
        const workspaces = await toggl.getWorkspaces();
        expect(workspaces).to.not.empty;

        const currentWorkspace = parseInt(mockConfig.getValue('WORKSPACE_ID')) || 0;
        const workspaceIDs = workspaces.map((w) => w.id);
        expect(workspaceIDs).includes(currentWorkspace);
    });

    it('should get report detail for today for standard workspace', async function() {
        const fromDate = new Date();
        const toDate = new Date();
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
            pid: parseInt(mockConfig.getValue('PROJECT_TEST_ID')) || 0,
            created_with: mockConfig.getValue('APP_NAME') || '',
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
        entriesToDelete.forEach(async (entry) => {
            await toggl.deleteEntry(entry);
        });
    });
});

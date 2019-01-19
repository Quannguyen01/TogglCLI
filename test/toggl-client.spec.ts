import { TogglClientApi } from '../src/toggl-client';
import { TimeEntry } from '../src/model/TimeEntry';
import { startUp } from '../src/startup';
import { expect } from 'chai';

const PROJECT_TEST_ID = 148757817;
const APP_NAME = 'my-toggl-client';

describe('Toggl API Testing', function() {
    let toggl: TogglClientApi;
    before(function() {
        startUp();
    });

    beforeEach(function() {
        toggl = new TogglClientApi();
    });

    it('should create a time entry using toggl client api', async function() {
        let entry: TimeEntry = {
            description: 'Meeting with possible client',
            tags: ['billed'],
            duration: 1200,
            start: new Date('2013-03-05T07:58:58.000Z'),
            pid: PROJECT_TEST_ID,
            created_with: APP_NAME
        };
        
        let result = await toggl.createEntry(entry);
        expect(result.pid).to.not.be.null;
        expect(result).to.be.not.undefined;
        expect(result.description).to.equal(entry.description);
    });

    it('should find a toggl project with specified project name', async function() {
        let result = await toggl.findProjectId('Toggl CLI');
        expect(result).to.not.be.null;
        expect(result).to.be.not.undefined;
    });

    it('should start a time entry', async function() {
        let entry: TimeEntry = {
            description: 'Testing starting time entry from Toggl client',
            tags: ['dev'],
            pid: PROJECT_TEST_ID,
            created_with: APP_NAME
        };

        let result = await toggl.startEntry(entry);
        expect(result).to.not.be.null;

        if(result)
            expect(result.description).to.equal(entry.description);
    });

    it('should get the current running entry from toggl', async function() {
        await toggl.startEntry({
            description: 'Testing adding new entry to get current',
            pid: PROJECT_TEST_ID,
            created_with: APP_NAME
        });

        let result = await toggl.getCurrent();
        expect(result).to.be.not.undefined;
        expect(result).to.be.not.null;
        if (result) {
            expect(result.description).to.equal('Testing adding new entry to get current');
        }
    });

    it('should stop the current running entry in toggl', async function() {
        let runningEntry = await toggl.startEntry({
            description: 'Testing adding new entry to stop',
            pid: PROJECT_TEST_ID,
            created_with: APP_NAME
        });

        let entryId = runningEntry && runningEntry.id ? runningEntry.id : -1;
        let result = await toggl.stopEntry(entryId);

        expect(result).to.be.not.undefined;
        if (result) {
            expect(result.description).to.equal('Testing adding new entry to stop');
            expect(result.id).to.equal(entryId);
        }
    })
});
import { TogglClientApi } from '../src/toggl';
import { TimeEntry } from '../src/model/TimeEntry';
import { startUp } from '../src/startup';
import { expect } from 'chai';

describe('Toggl', () => {
    let toggl: TogglClientApi;
    before(() => {
        startUp();
    });

    beforeEach(() => {
        toggl = new TogglClientApi();
    });

    it('should create a time entry using toggl client api', async () => {
        let entry: TimeEntry = {
            description: "Meeting with possible client",
            tags: ["billed"],
            duration: 1200,
            start: new Date("2013-03-05T07:58:58.000Z"),
            pid: 148757817,
            created_with: "my-toggl-client"
        };
        
        let result = await toggl.createEntry(entry);
        expect(result.pid).to.not.be.null;
        expect(result.description).to.equal(entry.description);
    });

    it('should start a toggl entry and return a successful object', async () => {
        let result = await toggl.start('Test adding new entry', 'Toggl CLI');
        expect(result.pid).to.not.be.null;
        expect(result.description).to.equal('Test adding new entry');
    });

    it('should find a toggl project with specified project name', async() => {
        let result = await toggl.findProjectId('Toggl CLI');
        expect(result).to.not.be.null;
        expect(result).to.not.be.undefined;
    });
});
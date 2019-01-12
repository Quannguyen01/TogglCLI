import { TogglClientApi } from '../src/toggl';
import { TimeEntry } from '../src/model/TimeEntry';
import { startUp } from '../src/startup';
import { expect } from 'chai';

describe('Toggl', () => {
    before(() => {
        startUp();
    });

    it('should create a time entry using toggl client api', async () => {
        let toggl = new TogglClientApi();
        let entry: TimeEntry = {
            description: "Meeting with possible client",
            tags: ["billed"],
            duration: 1200,
            start: new Date("2013-03-05T07:58:58.000Z"),
            pid: 148757817,
            created_with: "my-toggl-client"
        };
        
        let result = await toggl.createEntry(entry);
        console.log(result);
        expect(result.pid).to.not.be.null;
        expect(result.description).to.equal(entry.description);
    });

    it('should start a toggl entry and return a successful object', async () => {
        let toggl = new TogglClientApi();
        let result = await toggl.start("Test adding new entry");
        expect(result.pid).to.not.be.null;
        expect(result.description).to.equal("Test adding new entry");
    });
});
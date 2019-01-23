import { TogglFacade } from "../src/toggl-facade";
import { startUp } from "../src/startup";
import { expect } from "chai";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Toggl Facade test', function() {
    before(function() {
        startUp();
    });

    it('should start a toggl entry and return a successful object', async function() {
        let result = await (new TogglFacade()).start('Test adding new facade entry', 'Toggl CLI');
        expect(result.description).to.equal('Test adding new facade entry');
    });

    it('should stop a toggl entry that is currently running', async function() {
        this.timeout(4000);

        const toggl = new TogglFacade();
        await toggl.start('Test adding/stopping new entry from facade', 'Toggl CLI');

        await sleep(2000);

        let result = await toggl.stop();
        expect(result).to.greaterThan(0);
    });

    it('should display the name and duration of the task', async function() {
        this.timeout(3000);
        const toggl = new TogglFacade();

        await toggl.start('Testing current entry', 'Toggl CLI');
        await sleep(2000);

        let result = await toggl.current();

        expect(result.duration).is.not.null;
        if (result.duration)
            expect(Math.trunc(result.duration)).to.equal(2);
        expect(result.description).to.equal('Testing current entry');
    });
});
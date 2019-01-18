import { TogglFacade } from "../src/toggl-facade";
import { startUp } from "../src/startup";
import { expect } from "chai";

describe('Toggl Facade test', () => {
    before(() => {
        startUp();
    });

    it('should start a toggl entry and return a successful object', async () => {
        let result = await (new TogglFacade()).start('Test adding new facade entry', 'Toggl CLI');
        expect(result.description).to.equal('Test adding new facade entry');
    });

    it('should stop a toggl entry that is currently running', async() => {
        const toggl = new TogglFacade();
        await toggl.start('Test adding/stopping new entry from facade', 'Toggl CLI');

        let result = await toggl.stop();
        expect(result).to.be.true;
    });
});
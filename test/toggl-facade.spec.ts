import { TogglFacade } from "../src/toggl-facade";
import { startUp } from "../src/startup";
import { expect } from "chai";

describe('Toggl Facade test', () => {
    before(() => {
        startUp();
    });

    it('should start a toggl entry and return a successful object', async () => {
        let result = await (new TogglFacade()).start('Test adding new facade entry', 'Study');
        expect(result.description).to.equal('Test adding new facade entry');
    });

});
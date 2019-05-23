import { TogglFacade } from '../../src/toggl-facade';
import { expect } from 'chai';
import { IConfigManager } from '../../src/interface/IConfigManager';
import { ConfigManager } from '../../src/config-manager';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Toggl Facade intergration test', function() {
    let config: IConfigManager;
    let toggl: TogglFacade;

    before(function() {
        config = ConfigManager.initialize('test.yml');
    });

    beforeEach(function() {
        toggl = new TogglFacade(config);
    });

    it('should start a toggl entry and return a successful object', async function() {
        const result = await toggl.start('Test adding new facade entry', 'Toggl CLI');
        expect(result.description).to.equal('Test adding new facade entry');
    });

    it('should stop a toggl entry that is currently running', async function() {
        this.timeout(4000);

        await toggl.start('Test adding/stopping new entry from facade', 'Toggl CLI');

        await sleep(2000);

        const result = await toggl.stop();
        expect(result).to.greaterThan(0);
    });

    it('should display the name and duration of the task', async function() {
        this.timeout(4000);

        await toggl.start('Testing current entry', 'Toggl CLI');
        await sleep(2500);

        const result = await toggl.current();

        expect(result.duration).is.not.null;
        if (result.duration) {
            expect(result.duration < 4 &&
                result.duration >= 1.5).to.be.true;
        }
        expect(result.description).to.equal('Testing current entry');
    });

    it('should alter value of api key in the config', async function() {
        const oldApiKey = config.getValue('API_KEY');

        await toggl.setApiKey('testing');

        const key = config.getValue('API_KEY');
        expect(key).equals('testing');

        await toggl.setApiKey(oldApiKey);
    });

    it('should alter value of workspace id in the config', async function() {
        const oldWorkspace = await toggl.getCurrentWorkspace();

        if (oldWorkspace != null) {
            const result = await toggl.setWorkspace('Toggl CLI Test');
            const workspace = config.getValue('WORKSPACE_ID');

            expect(result).to.be.true;
            expect(workspace).not.equal(oldWorkspace.id);

            await toggl.setWorkspace(oldWorkspace.name);
        } else {
            this.skip();
        }
    });

    it('should get available workspace name', async function() {
        const workspaceID = parseInt(config.getValue('WORKSPACE_ID'));
        const workspaces = (await toggl.getWorkspaces()).map((w) => w.id);
        expect(workspaces).includes(workspaceID);
    });

    it('should get all the time entries for May 10 2019, expect 18 of them', async function() {
        const day = new Date('2019-05-10');
        const tasks = (await toggl.getEntriesForDay(day));
        expect(tasks.length).to.equal(18);
    });
});

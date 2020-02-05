import { expect } from 'chai';
import TogglFacade from '../../src/toggl-facade';
import IConfigManager from '../../src/interface/IConfigManager';
import FakeConfig from '../mock-object/fake-config';
import FakeClientApi from '../mock-object/fake-client-api';

export const facadeTest = describe('Toggl Facade intergration test', function() {
    let config: IConfigManager;
    let toggl: TogglFacade;
    let client: FakeClientApi;

    before(function() {
        config = new FakeConfig();
        client = new FakeClientApi();
    });

    beforeEach(function() {
        toggl = new TogglFacade(config, client);
    });

    it('should start a toggl entry and return a successful object', async function() {
        const result = await toggl.start('Test adding new facade entry', 'Toggl CLI');
        expect(result.description).to.equal('Test adding new facade entry');
    });

    it('should stop a toggl entry that is currently running', async function() {
        await toggl.start('Test adding/stopping new entry from facade', 'Toggl CLI');
        const result = await toggl.stop();

        expect(result).to.equal(200);
    });

    it('should display the name and duration of the task', async function() {
        await toggl.start('Testing current entry', 'Toggl CLI');

        const result = await toggl.current();

        expect(result.duration).is.not.null;
        if (result.duration) {
            expect(result.duration).to.equal(10);
            expect(result.description).to.equal('Testing current entry');
        }
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
            expect.fail();
        }
    });

    it('should get available workspace name', async function() {
        const workspaceID = parseInt(config.getValue('WORKSPACE_ID'));
        const workspaces = (await toggl.getWorkspaces()).map((w) => w.id);
        expect(workspaces).includes(workspaceID);
    });

    it('should get all the time entries for today', async function() {
        const day = new Date();
        const tasks = await toggl.getEntriesForDay(day);

        expect(tasks.find((entry) => entry.description === 'Test adding new facade entry'))
            .to.not.be.undefined;
    });

    it('should create a task and delete it immediately', async function() {
        const entry = await toggl.start('Test deleting facade entry', 'Toggl CLI');

        if (entry != null) {
            const entryId = entry.id || 0;
            await toggl.stop();

            const result = await toggl.deleteEntry(entryId);
            expect(result).to.be.true;
        } else {
            expect.fail('Entry should not be null!');
        }
    });

    it('should find a toggl project with specified project name', async function() {
        const result = await toggl.findProjectId('Toggl CLI');
        expect(result).to.not.be.null;
        expect(result).to.be.not.undefined;
    });

    it('should list all the projects available in the current workspace', async function() {
        const result = await toggl.getProjects();
        expect(result.length).not.equal(0);
    });
});

facadeTest.run();

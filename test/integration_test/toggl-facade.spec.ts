import { TogglFacade } from '../../src/toggl-facade';
import { expect } from 'chai';
import { IConfigManager } from '../../src/interface/IConfigManager';
import { ConfigManager } from '../../src/config-manager';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Toggl Facade intergration test', function() {
    let config: IConfigManager;

    before(function() {
        config = ConfigManager.initialize('test.yml');
    });

    it('should start a toggl entry and return a successful object', async function() {
        const result = await (new TogglFacade(config)).start('Test adding new facade entry', 'Toggl CLI');
        expect(result.description).to.equal('Test adding new facade entry');
    });

    it('should stop a toggl entry that is currently running', async function() {
        this.timeout(4000);

        const toggl = new TogglFacade(config);
        await toggl.start('Test adding/stopping new entry from facade', 'Toggl CLI');

        await sleep(2000);

        const result = await toggl.stop();
        expect(result).to.greaterThan(0);
    });

    it('should display the name and duration of the task', async function() {
        this.timeout(4000);
        const toggl = new TogglFacade(config);

        await toggl.start('Testing current entry', 'Toggl CLI');
        await sleep(2000);

        const result = await toggl.current();

        expect(result.duration).is.not.null;
        if (result.duration) {
            expect(result.duration < 4 &&
                result.duration >= 2).to.be.true;
        }
        expect(result.description).to.equal('Testing current entry');
    });

    it('should alter value of api key in the config', function() {
        const oldApiKey = config.getValue('API_KEY');

        const toggl = new TogglFacade(config);
        toggl.setApiKey('testing');

        const key = config.getValue('API_KEY');
        expect(key).equals('testing');

        toggl.setApiKey(oldApiKey);
    });
});

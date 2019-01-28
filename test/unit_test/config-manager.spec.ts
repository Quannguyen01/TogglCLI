import { expect } from "chai";
import { ConfigManager } from "../../src/config-manager";
import { IConfigManager } from "../../src/interface/IConfigManager";

describe('configuration manager', function() {
    let config : IConfigManager;
    before(function() {
        config = ConfigManager.initialize('test.yml');
    });

    it('should get api key', function() {
        const apiKey = config.getValue('API_KEY');
        expect(apiKey).to.not.be.null.and.not.empty;
    });

    it('should get the active current workspace id', function() {
        const workspaceid = config.getValue('WORKSPACE_ID');
        expect(typeof workspaceid).to.equal('number');
        expect(workspaceid).to.be.greaterThan(0);
    });

    it('should store the value to the config file', function() {
        const oldValue = config.getValue('API_KEY');

        config.setValue('API_KEY', 'testing');
        let apiKey = config.getValue('API_KEY');
        expect(apiKey).equals('testing');

        config = ConfigManager.initialize('test.yml');
        apiKey = config.getValue('API_KEY');
        expect(apiKey).equals('testing');

        config.setValue('API_KEY', oldValue);
    });
});

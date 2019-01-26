import { expect } from "chai";
import { ConfigManager } from "../../src/config-manager";

describe('configuration manager', function() {
    let config : ConfigManager;
    before(function() {
        config = ConfigManager.initialize('test.yml');
    });

    it('should get api key', function() {
        const apiKey = config.getValue('API_KEY');
        expect(apiKey).to.not.be.null.and.not.empty;
    });
});
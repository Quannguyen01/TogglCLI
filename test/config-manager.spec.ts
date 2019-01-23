import { expect } from "chai";
import { ConfigManager } from "../src/config-manager";

describe('configuration manager', function() {
    before(function() {
        ConfigManager.initialize();
    });

    it('should get api key', function() {
        const apiKey = ConfigManager.getValue('api_key');
        expect(apiKey).to.not.be.null.and.not.empty;
    });
});
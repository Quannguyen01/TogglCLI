import { readFileSync } from 'fs';
import { parseDocument } from 'yaml';
import { IConfigManager } from './interface/IConfigManager';

export class ConfigManager implements IConfigManager {
    private configValues: Map<string, any>;

    private constructor(configValues: Map<string, any>) {
        this.configValues = configValues;
    }

    static initialize(configPath: string = '') {
        const file = readFileSync(configPath, 'utf8');
        const doc = parseDocument(file);

        const configValues = new Map<string, any>();
        if (doc.contents) {
            let contentJSON = doc.contents.toJSON();
            for (let key in contentJSON)
                configValues.set(key, contentJSON[key]);
        }

        return new ConfigManager(configValues);
    }

    getValue(name: string) {
        if (this.configValues.has(name))
            return this.configValues.get(name);
        else
            return null;
    }
}

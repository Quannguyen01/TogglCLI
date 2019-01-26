import { readFileSync } from 'fs';
import { parseDocument } from 'yaml';
import { IConfigManager } from './interface/IConfigManager';

export class ConfigManager implements IConfigManager {
    static initialize(configPath: string = '') {
        const file = readFileSync(configPath, 'utf8');
        const doc = parseDocument(file);

        const configValues = new Map<string, any>();
        if (doc.contents) {
            const contentJSON = doc.contents.toJSON();
            for (const key of contentJSON) {
                configValues.set(key, contentJSON[key]);
            }
        }

        return new ConfigManager(configValues);
    }

    private configValues: Map<string, any>;

    private constructor(configValues: Map<string, any>) {
        this.configValues = configValues;
    }

    getValue(name: string) {
        if (this.configValues.has(name)) {
            return this.configValues.get(name);
        } else {
            return null;
        }
    }
}

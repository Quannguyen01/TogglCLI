import { readFileSync } from 'fs';
import { parseDocument } from 'yaml';

export class ConfigManager {
    private static PATH = 'test.yml';
    private static configValues: Map<string, any>;

    static initialize(configPath: string = '') {
        
        if (configPath && configPath != '') {
            this.PATH = configPath;
        }

        const file = readFileSync(this.PATH, 'utf8');
        const doc = parseDocument(file);

        this.configValues = new Map<string, any>();
        if (doc.contents) {
            let contentJSON = doc.contents.toJSON();
            for (let key in contentJSON)
                this.configValues.set(key, contentJSON[key]);
        }
    }

    static getValue(name: string) {
        if (this.configValues.has(name))
            return this.configValues.get(name);
        else
            return null;
    }
}

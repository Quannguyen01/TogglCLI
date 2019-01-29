import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parseDocument, stringify } from 'yaml';
import { IConfigManager } from './interface/IConfigManager';

export class ConfigManager implements IConfigManager {
    static initialize(configPath: string = '') {
        function getConfigData(configPath: string) {
            const configValues = new Map<string, any>();

            if (existsSync(configPath)) {
                const file = readFileSync(configPath, 'utf8');
                const doc = parseDocument(file);
        
                if (doc.contents) {
                    const contentJSON = doc.contents.toJSON();
                    for (const key in contentJSON) {
                        if (contentJSON.hasOwnProperty(key)) {
                            configValues.set(key, contentJSON[key]);
                        }
                    }
                }
            } else {
                console.log(`Config file not found, generating new config at ${configPath}`);
                writeFileSync(configPath, '', 'utf8');
            }

            return configValues;
        }

        const configValues = getConfigData(configPath);
        return new ConfigManager(configValues, configPath);
    }

    private configValues: Map<string, any>;
    private configPath: string;

    private constructor(configValues: Map<string, any>, configPath: string) {
        this.configValues = configValues;
        this.configPath = configPath;
    }

    getValue(name: string) {
        if (this.configValues.has(name)) {
            return this.configValues.get(name);
        } else {
            return null;
        }
    }

    setValue(name: string, value: any): void {
        this.configValues.set(name, value);
        writeFileSync(this.configPath, stringify(this.configValues), 'utf8');
    }
}

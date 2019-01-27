import { config } from 'dotenv';
import { IConfigManager } from '../../src/interface/IConfigManager';

export class MockConfig implements IConfigManager{
    constructor() {
        config({path: './test/.env'});
    }

    getValue(name: string) {
        return process.env[name];
    }

    setValue(name: string, value: any) {
        process.env[name] = value;
    }
}

import { config } from 'dotenv';
import IConfigManager from '../../src/interface/IConfigManager';

export default class FakeConfig implements IConfigManager {
    constructor() {
        config({path: '.env'});
    }

    getValue(name: string) {
        return process.env[name];
    }

    setValue(name: string, value: any) {
        process.env[name] = value;
    }
}

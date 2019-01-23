import { config } from 'dotenv';
import { ConfigManager } from './config-manager';

export function startUp() {
    //config();
    ConfigManager.initialize();
}

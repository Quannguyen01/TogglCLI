import { config } from 'dotenv';

export class MockConfig {
    static initialize() {
        config();
        
    }
}
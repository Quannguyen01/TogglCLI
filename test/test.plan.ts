import { configTest } from './unit-test/config-manager.spec';
import { togglCLientTest } from './integration-test/toggl-client.spec';
import { utilTest } from './unit-test/utils.spec';
import { facadeTest } from './unit-test/toggl-facade.spec';

describe('Toggl CLI testings', function() {
    configTest;
    togglCLientTest;
    utilTest;
    facadeTest;
});

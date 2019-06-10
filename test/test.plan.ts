import { configTest } from './unit_test/config-manager.spec';
import { togglCLientTest } from './unit_test/toggl-client.spec';
import { utilTest } from './unit_test/utils.spec';
import { facadeTest } from './integration_test/toggl-facade.spec';

describe('Toggl CLI testings', function() {
    configTest;
    togglCLientTest;
    utilTest;
    facadeTest;
});

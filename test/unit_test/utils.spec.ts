import { makePrettyTimeDuration } from '../../src/utils';
import { expect } from 'chai';

describe('utility test', function() {
    it('should test the converter from duration in second to `days and hh:mm:ss` format', function() {
        const result = makePrettyTimeDuration(260000);
        expect(result).to.equal('3 days - 00:13:20');
    });
});

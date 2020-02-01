import { makePrettyTimeDuration, getDatePortion, getTimePortion } from '../../src/utils';
import { expect } from 'chai';

export const utilTest = describe('utility test', function() {
    it('should test the converter from duration in second to `days and hh:mm:ss` format', function() {
        const result = makePrettyTimeDuration(260000);
        expect(result).to.equal('3 days - 00:13:20');
    });

    it('should get the date portion', function() {
        const date = new Date('2019-05-20T12:49:50');
        expect(getDatePortion(date)).equals('2019-05-20');
    });

    it('should get the time portion', function() {
        const date = new Date('2019-05-20T12:49:50');
        expect(getTimePortion(date)).equals('12:49:50');
    });
});

utilTest.run();

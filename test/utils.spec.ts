import { makePrettyTimeDuration } from "../src/utils";
import { expect } from "chai";

describe('utility test', function() {
    it('should test the converter from duration in second to `days and hh:mm:ss` format', function() {
        var result = makePrettyTimeDuration(260000)
        console.log(result);
        expect(result).to.equal('3 days - 0:13:20')
    });
})
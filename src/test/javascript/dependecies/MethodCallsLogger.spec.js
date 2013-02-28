var MethodCallsLogger = require('../../../main/javascript/MethodCallsLogger.js');

describe('MethodCallsLogger', function () {
    beforeEach(function () {
        this.define = new MethodCallsLogger({
            oldSkin: true
        });
    });

    describe('acceptance', function () {
        describe('when define.oldDskin is called', function () {
            it('should log the call params', function () {
                mockSkinDef = {mockSkin: true};

                this.define.oldSkin(mockSkinDef);

                expect(this.define.callsLog).toEqual({oldSkin: [
                    [mockSkinDef]
                ]});
            });
        });
    });

});
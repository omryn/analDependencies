var requireSrc = require('../helpers/requireSrc.js');
var MockDefineRunner = requireSrc('MockDefineRunner.js');
var path = require('path');

describe('MockDefineRunner', function () {
    describe('getDefinitions', function () {
        it('should return an object with the calls log of define.oldSkin in a script file',
            function (done) {
                MockDefineRunner.getDefinitions(path.join(__dirname, '../../resources/MockDefinition.js'),
                    function (result) {
                        expect(result).toEqual({
                            oldSkin: [  // one call to oldSkin
                                ['mock', 'definition'] // with the arguments: 'mock', 'definition'
                            ]
                        });
                        done();
                    });
            }, 250);
    });
});
var Analyzer = require('../../../main/javascript/Analyzer.js');
var path = require('path');
var self;

describe('Analyzer', function () {
        var analyzer;

        beforeEach(function(){
            analyzer = new Analyzer(path.join(__dirname, '../../resources'));
        });

        describe('acceptance', function () {
            describe('skin analysis', function () {
                describe('oldSkin', function () {
                    it('should extract "Extends" dependencies', function (done) {
                        analyzer.extractDirectDependenciesOf('old-skins/ButtonSkin.js', function (dependencies) {
                            expect(dependencies).toEqual(['mobile.core.skins.BaseSkin']);
                            done();
                        });
                    }, 200);
                });
            });
        });

        describe('integration', function () {

        });


        describe('unit', function () {
            describe('when a dependency has its own dependencies', function () {

            });
        });
    }
);

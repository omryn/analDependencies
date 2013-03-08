var Analyzer = require('../../../main/javascript/Analyzer.js');
var path = require('path');
var self;

describe('Analyzer', function () {
        var analyzer;

        beforeEach(function () {
            analyzer = new Analyzer(path.join(__dirname, '../../resources'));
        });

        describe('acceptance', function () {
            describe('skin analysis', function () {
                describe('oldSkin', function () {
                    it('should extract "Extends" dependencies', function (done) {
                        analyzer.extractDirectDependenciesOf('old-skins/ButtonSkin.js', function (dependencies) {
                            expect(dependencies).toEqual({
                                'skins.core.ButtonSkin': ['mobile.core.skins.BaseSkin']
                            });
                            done();
                        });
                    }, 200);
                });
            });
        });

        describe('integration', function () {

        });


        describe('unit', function () {
            describe('_groupByName', function () {
                it('should return an object where keys represent a name (dependent) and values are dependencies arrays', function () {
                    var result = analyzer._groupByName([
                        {name: 'a', dependencies: ['a', 'b']},
                        {name: 'b', dependencies: ['c', 'd']}
                    ]);
                    expect(result).toEqual({
                        a: ['a', 'b'],
                        b: ['c', 'd']
                    });
                });

                it('should group all dependencies by name', function () {
                    var result = analyzer._groupByName([
                        {name: 'a', dependencies: ['a', 'b']},
                        {name: 'a', dependencies: ['c']},
                        {name: 'b', dependencies: ['c', 'd']},
                        {name: 'b', dependencies: ['e']}
                    ]);
                    expect(result).toEqual({
                        a: ['a', 'b', 'c'],
                        b: ['c', 'd', 'e']
                    });
                });
                it('should contain no duplications', function () {
                    var result = analyzer._groupByName([
                        {name: 'a', dependencies: ['a', 'b']},
                        {name: 'a', dependencies: ['b', 'c']},
                        {name: 'a', dependencies: ['c', 'd']},
                    ]);
                    expect(result).toEqual({
                        a: ['a', 'b', 'c', 'd']
                    });
                });
            })
        });
    }
);

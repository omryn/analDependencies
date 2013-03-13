var path = require('path');
var requireSrc = require('../helpers/requireSrc.js');
var resource = require('../helpers/resource.js');

describe('FileAnalyzer', function () {
        var analyzer = requireSrc('FileAnalyzer');

        describe('acceptance', function () {
            describe('skin analysis', function () {
                describe('oldSkin', function () {
                    it('should extract "Extends" dependencies', function (done) {
                        analyzer.extractDirectDependenciesOf(resource('old-skins/ButtonSkin.js'),
                            function (errors, dependencies) {
                                expect(dependencies).toEqual({
                                    'skins.core.ButtonSkin': ['mobile.core.skins.BaseSkin']
                                });
                                expect(errors).toBe(null);
                                done();
                            });
                    }, 200);
                });
            });
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

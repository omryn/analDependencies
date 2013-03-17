"use strict";

var requireSrc = require('../helpers/requireSrc.js');

var fileAnalyzerMock = {};
var stubs = {
    './FileAnalyzer': fileAnalyzerMock
};

var MultiFileAnalizer = requireSrc('MultiFileAnalyzer', stubs);
var resource = require('../helpers/resource.js');

describe('MultiFileAnalyzer', function () {
    beforeEach(function () {
        this.multiFileAnalizer = new MultiFileAnalizer(resource('old-skins'));
    });

    describe('acceptance:', function () {

        it('should create an object with all dependencies of named definitions', function (done) {
            this.multiFileAnalizer.extractDependencies(
                [resource('old-skins/ButtonSkin.js'), resource('old-skins/ButtonSkin2.js')],
                function (errors, dependencies) {
                    expect(dependencies).toEqual({
                        'skins.core.ButtonSkin': ['mobile.core.skins.BaseSkin'],
                        'skins.core.ButtonSkin2': ['mobile.core.skins.BaseSkin']
                    });
                    expect(errors).toBeFalsy();
                    done();
                }
            );
        }, 200);

        it('should calculate dependencies of dependencies', function (done) {
            this.multiFileAnalizer.extractDependencies(
                [resource('old-skins/ButtonSkin.js'), resource('old-skins/ButtonSkinChild.js')],
                function (errors, dependencies) {
                    expect(dependencies).toEqual({
                        'skins.core.ButtonSkin': ['mobile.core.skins.BaseSkin'],
                        'skins.core.ButtonSkinChild': ['mobile.core.skins.BaseSkin', 'skins.core.ButtonSkin']
                    });
                    expect(errors).toBeFalsy();
                    done();
                }
            );
        }, 200);
    });

    describe('when analyzing a files list', function () {
        beforeEach(function () {
            var self = this;
            // mock results for extractDirectDependenciesOf (map: file -> callback arguments)
            this.mockResults = {};

            fileAnalyzerMock.extractDirectDependenciesOf = function (file, callback) {
                callback.apply(null, self.mockResults[file]);
            };
        });

        it('should combine the results of all file analysis', function (done) {
            this.mockResults = {
                fileA: [null, {a: ['A']}],
                fileB: [null, {b: ['B']}]
            };

            this.multiFileAnalizer.extractDependencies(
                ['fileA', 'fileB'],
                function (errors, dependencies) {
                    expect(dependencies).toEqual({
                        a: ['A'],
                        b: ['B']
                    });
                    expect(errors).toBeFalsy();
                    done();
                });
        }, 50);

        it('should exclude known dependencies from results', function (done) {
            this.mockResults = {
                fileA: [null, {a: ['A1','A2','A3']}]
            };

            this.multiFileAnalizer.setIgnoredDependencies(['A1','A2']);

            this.multiFileAnalizer.extractDependencies(
                ['fileA'],
                function (errors, dependencies) {
                    expect(dependencies).toEqual({
                        a: ['A3']
                    });
                    expect(errors).toBeFalsy();
                    done();
                });
        }, 50);

        it('should exclude entries with no dependencies', function (done) {
            this.mockResults = {
                fileA: [null, {a: []}]
            };

             this.multiFileAnalizer.extractDependencies(
                ['fileA'],
                function (errors, dependencies) {
                    expect(dependencies).toEqual({
                    });
                    expect(errors).toBeFalsy();
                    done();
                });
        }, 50);

        it('should calculate dependencies of known dependencies', function (done) {
            this.mockResults = {
                fileA: [null, {a: ['b']}],
                fileB: [null, {b: ['c']}],
                fileC: [null, {c: ['d']}]
            };

            this.multiFileAnalizer.extractDependencies(
                ['fileA', 'fileB', 'fileC'],
                function (errors, dependencies) {
                    expect(dependencies).toEqual({
                        a: ['b', 'c', 'd'],
                        b: ['c', 'd'],
                        c: ['d']
                    });
                    expect(errors).toBeFalsy();
                    done();
                });
        }, 50);

        it('should add duplicate definitions to the errors collection of the callback', function (done) {
            this.mockResults = {
                fileA: [null, {a: ['b']}],
                fileAVariant: [null, {a: ['c']}]
            };

            this.multiFileAnalizer.extractDependencies(
                ['fileA', 'fileAVariant'],
                function (errors, dependencies) {
                    expect(dependencies).toEqual({
                    });
                    expect(errors).toEqual([
                        {type: 'duplicate definition', name: 'a'}
                    ]);
                    done();
                });
        }, 50);
    });
});
"use strict";
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var mockDefineRunner = require('./MockDefineRunner.js');

function Analyzer(basePath) {
    this.setBasePath(basePath || process.cwd());
    this.cache = {};
}

function analyzeDependencies(definitions) {
    var analyzers = require('./analyzers/index');

    function extractDependenciesOfMethodCalls(methodName) {
        var analyzer = analyzers[methodName];
        var dependenciesPerCall = definitions[methodName] && analyzer && definitions[methodName].map(function (args) {
            return analyzer.apply(null, args);
        });
        return dependenciesPerCall;
    }

    var calledMethods = Object.keys(definitions);
    var dependencies = calledMethods.map(extractDependenciesOfMethodCalls);
    return _.chain(dependencies)
        .flatten()
        .compact()
        .value();
}

Analyzer.prototype = {
    setBasePath: function (basePath) {
        basePath = path.resolve(basePath)
        if (fs.existsSync(basePath) && fs.statSync(basePath).isDirectory()) {
            this.basePath = basePath;
        } else {
            throw new Error('Invalid path: ' + path + ' is not an existing directory');
        }
    },


    extractDirectDependenciesOf: function (filePath, callback) {
        var self = this;
        filePath = path.join(this.basePath, filePath);
        mockDefineRunner.getDefinitions(filePath, function (definitions) {
            var directDependencies = analyzeDependencies(definitions);
            self.cache[filePath] = directDependencies;
            callback(directDependencies);
        });
    },

    extractDependenciesMap: function (files, callback) {

    }
};

module.exports = Analyzer;

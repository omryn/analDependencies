"use strict";
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var mockDefineRunner = require('./MockDefineRunner.js');
var assert = require('./assert.js');

function Analyzer(basePath) {
    this.setBasePath(basePath || process.cwd());
}

function analyzeDependencies(definitions) {
    var analyzers = require('./analyzers/index');

    function extractDependenciesOfMethodCalls(methodName) {
        var analyzer = assert(analyzers[ methodName], "missing analyser: " + methodName);
        var dependenciesPerCall = assert(definitions, methodName, "missing method definition: " + methodName)
            .map(function (args) {
                return analyzer.apply(null, args);
            });
        return dependenciesPerCall.dependencies;
    }

    var calledMethods = Object.keys(definitions);
    var dependencies = _.chain(calledMethods)
        .map(extractDependenciesOfMethodCalls)
        .flatten()
        .compact()
        .value();
    return dependencies;
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
        filePath = path.join(this.basePath, filePath);
        mockDefineRunner.getDefinitions(filePath, function (definitions) {
            var result = analyzeDependencies(definitions);
            console.log(require('util').inspect(result));
            callback(result.name, result.dependencies);
        });
    }
};

module.exports = Analyzer;

"use strict";
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var mockDefineRunner = require('./MockDefineRunner.js');
var assert = require('./assert.js');

function Analyzer(basePath) {
    this.setBasePath(basePath || process.cwd());
}


function analyzeDependencies(definitions, self) {
    var analyzers = require('./analyzers/index');

    function extractDependenciesOfMethodCalls(methodName) {
        var analyzer = assert(analyzers[ methodName], "missing analyser: " + methodName);
        var dependenciesPerCall = assert(definitions, methodName, "missing method definition: " + methodName)
            .map(function (args) {
                var analyzedResult = analyzer.apply(null, args);
                return analyzedResult;
            });
        return dependenciesPerCall;
    }

    var calledMethods = Object.keys(definitions);
    var rawDependencies = _.chain(calledMethods)
        .map(extractDependenciesOfMethodCalls)
        .flatten()
        .value();

    console.log('raw dependencies:' + require('util').inspect(rawDependencies));
    var byName = self._groupByName(rawDependencies);
    console.log('dependencies by name:' + require('util').inspect(byName));
    return byName;
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
            var result = analyzeDependencies(definitions, self);
            callback(result);
        });
    },

    _groupByName: function (rawDependencies) {
        return _.reduce(rawDependencies, function (result, item) {
            var dependencies = _.chain(item.dependencies)
                .union(result[item.name] || [])
                .uniq()
                .sort()
                .value();

            result[item.name] = dependencies;
            return result;
        }, {});
    }
};

module.exports = Analyzer;

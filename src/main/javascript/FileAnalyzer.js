"use strict";
var _ = require('underscore');
var mockDefineRunner = require('./MockDefineRunner.js');
var assert = require('./assert.js');


function extractDirectDependenciesOf(filePath, callback) {
    mockDefineRunner.getDefinitions(filePath, function (errors, definitions) {
        var result = analyzeDependencies(definitions);
        callback(null, result);
    });
}


function analyzeDependencies(definitions) {
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

    var byName = _groupByName(rawDependencies);
    return byName;
}


function _groupByName(rawDependencies) {
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


module.exports = {
    extractDirectDependenciesOf: extractDirectDependenciesOf,
    _groupByName: _groupByName
};

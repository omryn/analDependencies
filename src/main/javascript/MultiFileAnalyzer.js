"use strict";
var _ = require('underscore');
var fileAnalyzer = require('./FileAnalyzer');

/**
 * @param {String} basePath
 * @constructor
 */
function MultiFileAnalyzer() {
    this.ignoredDependencies = [];
}

MultiFileAnalyzer.prototype = {
    /**
     *
     * @param {Array<String>} filesArray files to analyze
     * @param {Function} callback
     */
    extractDependencies: function (filesArray, callback) {
        this.results = this.results || {};
        this.errors = this.errors || [];

        filesArray.forEach(function (file) {
            fileAnalyzer.extractDirectDependenciesOf(file, this._createCallback(callback));
        }, this);
    },

    /**
     *
     */
    setIgnoredDependencies: function (ignoredDependenciesArray) {
        this.ignoredDependencies = ignoredDependenciesArray;
    },

    _calculateDependenciesOfDependencies: function () {
        var knownDependencies = _.keys(this.results);
        var updated;
        var self = this;

        function getExpandedDependencies(name) {
            return _.union([name], self.results[name] || []);
        }

        function knownDependenciesOf(name) {
            return self.results[name];
        }

        function removeEntriesWithNoDependencies(name) {
             if (knownDependenciesOf(name).length === 0) {
                 delete self.results[name];
             }
        }

        function expandDependencies(name) {
            var dependencies = _.chain(knownDependenciesOf(name))
                .difference(self.ignoredDependencies)
                .map(getExpandedDependencies)
                .flatten()
                .uniq()
                .without(name)
                .sort()
                .value();
            if (self.results[name].length !== dependencies.length) {
                updated = true;
                self.results[name] = dependencies;
            }
        }
        do {
            updated = false;
            knownDependencies.forEach(expandDependencies);
        } while (updated);


        knownDependencies.forEach(removeEntriesWithNoDependencies);
    },

    _checkPendingResults: function (finalCallback) {
        if (this.pendingCallbacks && this.pendingCallbacks.length === 0) {
            this.errors = (this.errors && this.errors.length > 0) ? this.errors : null;
            this._calculateDependenciesOfDependencies();
            finalCallback(this.errors, this.results);
        }
    },

    _createCallback: function (finalCallback) {
        var self = this;
        this.pendingCallbacks = this.pendingCallbacks || [];

        var callback = function (errors, newResults) {
            self._addToResults(errors, newResults);
            self.pendingCallbacks = _.without(self.pendingCallbacks, callback);
            process.nextTick(self._checkPendingResults.bind(self, finalCallback));
        };

        this.pendingCallbacks.push(callback);
        return callback;
    },

    _addToResults: function (errors, newResults) {
        var commonNames = _.intersection(_.keys(this.results), _.keys(newResults));
        commonNames.forEach(function (duplication) {
            delete this.results[duplication];
            delete newResults[duplication];
            this.errors.push(
                {type: 'duplicate definition', name: duplication}
            );
        }, this);
        this.results = _.extend(this.results, newResults);
    }
};

module.exports = MultiFileAnalyzer;
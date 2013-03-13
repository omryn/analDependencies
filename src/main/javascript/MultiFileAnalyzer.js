var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var fileAnalyzer = require('./FileAnalyzer');

/**
 * @param {String} basePath
 * @constructor
 */
function MultiFileAnalyzer() {
}

/**
 *
 * @param {Array<String>} filesArray files to analyze
 * @param {Function} callback
 */
MultiFileAnalyzer.prototype = {
    extractDependencies: function (filesArray, callback) {
        this.results = this.results || {};
        this.errors = this.errors || [];

        filesArray.forEach(function (file) {
            fileAnalyzer.extractDirectDependenciesOf(file, this._createCallback(callback));
        }, this);
    },

    calcuclateDependenciesOfDependencies: function () {
        var knownDependencies = _.keys(this.results);
        var updated;
        var self = this;

        function explodeKnowDependencies(name) {
            return _.union([name], self.results[name] || []);
        }

        function knownDependenciesOf(name) {
            return self.results[name];
        }

        do {
            updated = false;
            knownDependencies.forEach(function (name) {
                var dependencies = _.chain(knownDependenciesOf(name))
                    .map(explodeKnowDependencies)
                    .flatten()
                    .uniq()
                    .without(name)
                    .sort()
                    .value();
                if (this.results[name].length !== dependencies.length) {
                    updated = true;
                    this.results[name] = dependencies;
                }
            }, this);
        } while (updated);
    },

    _checkPendingResults: function (finalCallback) {
        if (this.pendingCallbacks && this.pendingCallbacks.length === 0) {
            this.errors = (this.errors && this.errors.length > 0) ? this.errors : null;
            this.calcuclateDependenciesOfDependencies();
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
        }

        this.pendingCallbacks.push(callback);
        return callback;
    },

    _addToResults: function (errors, newResults) {
        var commonNames = _.intersection(_.keys(this.results), _.keys(newResults));
        commonNames.forEach(function (duplication) {
            delete this.results[duplication];
            delete newResults[duplication];
            this.errors.push(
                {type: 'duplicate definition', name: 'a'}
            )
        }, this)
        this.results = _.extend(this.results, newResults);
    }
}
;

module.exports = MultiFileAnalyzer;
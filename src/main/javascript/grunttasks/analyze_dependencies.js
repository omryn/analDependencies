"use strict";
module.exports = function (grunt) {
    var _ = grunt.util._;
    var MultiFileAnalyzer = require('../MultiFileAnalyzer.js');

    grunt.registerTask('analyze_dependencies', function () {
        this.requiresConfig('analyze_dependencies.includes');
        this.requiresConfig('analyze_dependencies.dest');
        this.requiresConfig('analyze_dependencies.ignoreDependencies');
        var included = grunt.config('analyze_dependencies.includes');
        var excludes = grunt.config('analyze_dependencies.excludes') || [];
        var dest = grunt.config('analyze_dependencies.dest');
        var ignoreDependencies = grunt.config('analyze_dependencies.ignoreDependencies');

        var patterns = _.union(included, excludes.map(function (item) {
            return '!' + item;
        }));

        var analyzer = new MultiFileAnalyzer();
        var includedFiles = grunt.file.expand(patterns);
        var done = this.async();

        analyzer.setIgnoredDependencies(ignoreDependencies);
        analyzer.extractDependencies(includedFiles, function (errors, results) {
            grunt.file.write(dest, JSON.stringify(results));
            grunt.file.write(dest + '.files', JSON.stringify(includedFiles, null, 4));

            if (errors) {
                grunt.fail.warn(require('util').inspect(errors));
                done(false);
            } else {
                done();
            }
        });
    });
};
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine_node: {
            specNameMatcher: "spec",
            projectRoot: ".",
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: true,
                savePath: "./target/reports",
                useDotNotation: true,
                consolidate: true
            }
        },
        jshint: {
            all: ['src/**/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                browser: false,
                node: true,
                jquery: true,
                globals: {
                    beforeEach: true,
                    afterEach: true,
                    describe: true,
                    it: true,
                    expect: true,
                    waitsFor: true,
                    runs: true,
                    jasmine: true,
                    createSpy: true
                }
            }
        },
        analyze_dependencies: {
            includes: ["src/test/resources/**/*.js"],
            excludes: ["**/Mock*"],
            dest: 'target/dependencies.json' ,
            ignoreDependencies: [
                'mobile.core.skins.BaseSkin'
            ]
        },
        clean: ["target"]
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadTasks('src/main/javascript/grunttasks');

    grunt.registerTask('default', ['jshint', 'clean', 'analyze_dependencies']);

};
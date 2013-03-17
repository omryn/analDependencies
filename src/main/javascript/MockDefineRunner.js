"use strict";
var fs = require('fs');
var vm = require('vm');
var MethodCallsLogger = require('./MethodCallsLogger.js');

module.exports = {
    getDefinitions: function (filePath, callback) {
        fs.readFile(filePath, 'utf8', function (err, script) {
            if (err) {
                throw new Error('Error reading file: '+filePath);
            } else {
                var temp = global.define;
                global.define = new MethodCallsLogger({oldSkin: true});

                vm.runInThisContext(script);
                var result = global.define.callsLog;

                global.define = temp;

                callback(null, result);
            }
        });
    }
};
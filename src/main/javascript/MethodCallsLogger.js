"use strict";
function argsAsArray(args) {
    return Array.prototype.splice.call(args, 0);
}

function createLogMethods(scope, methods) {
    Object.keys(methods).forEach(function (name) {
        scope[name] = function () {
            var args = argsAsArray(arguments);
            scope.callsLog[name] = scope.callsLog[name] || [];
            scope.callsLog[name].push(args);
        };
    });
}

function MethodCallsLogger(methods) {
    this.callsLog = {};
    createLogMethods(this, methods);
}
module.exports = MethodCallsLogger;
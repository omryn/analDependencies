function MethodCallsLogger(methods) {
    "use strict";
    var self = this;

    function argsAsArray(args) {
        return Array.prototype.splice.call(args, 0);
    }

    function createLogMethods(methods) {
        Object.keys(methods).forEach(function (name) {
            self[name] = function () {
                var args = argsAsArray(arguments);
                self.callsLog[name] = self.callsLog[name] || [];
                self.callsLog[name].push(args);
            }
        });
    };

    this.callsLog = {};
    createLogMethods(methods);
}
module.exports = MethodCallsLogger;
"use strict";
var path = require('path');

module.exports = function (src) {

    var resourcePath = path.resolve(path.join(__dirname, '../../resources/', src));
    return resourcePath;
};
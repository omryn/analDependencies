var path = require('path');
var proxyquire = require('proxyquire');

module.exports = function (src, stubs) {
    var srcPath = path.join(__dirname, '../../../main/javascript', src)
    return proxyquire(srcPath, stubs || {});
}
var path = require('path');

module.exports = function(src) {
    var srcPath = path.join(__dirname, '../../../main/javascript', src)
    return require(srcPath);
}
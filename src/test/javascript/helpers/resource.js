var path = require('path');

module.exports = function(src) {

    var resourcePath = path.join(__dirname, '../../resources/', src);
    return resourcePath;
}
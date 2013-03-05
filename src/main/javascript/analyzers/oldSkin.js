require("node-jquery");
var _ = require('underscore');
var SKIN_PATTERN = /^([a-z]+\.)+([A-Z]\w+)/;


function extractComps(dependencies, definition) {
    if (definition && definition.Class && definition.Class._comps) {
        definition.Class._comps.forEach(function (compDef) {
            if (compDef && compDef.skin) {
                dependencies.push(compDef.skin);
            }
        });
    }
}

function extractHtml(dependencies, definition) {
    if (definition && definition.Class && definition.Class._html) {
        var html = '<wrapper>' + definition.Class._html + '</wrapper>';
        var skins = $(html).find('[skin]').attr('skin', function (index, skin) {
            dependencies.push(skin);
            return skin;
        });
    }
}

function extractSimpleFields(dependencies, definition) {
    if (definition && definition.Class) {
        Object.keys(definition.Class).forEach(function (key) {
            var value = definition.Class[key];
            if (typeof value == 'string' && SKIN_PATTERN.test(value)) {
                dependencies.push(value);
            }
        });
    }
}

function extractName(definition) {
    return definition.name;
}


module.exports = function (definition) {
    var dependencies = [];
    var result = {};

    extractSimpleFields(dependencies, definition)
    extractComps(dependencies, definition);
    extractHtml(dependencies, definition);

    result.name = extractName(definition);
    result.dependencies = dependencies;
    return result;
};
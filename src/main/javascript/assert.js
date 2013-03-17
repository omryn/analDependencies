"use strict";
/******** Helpers ******/
function getValueToAssert(field, value) {
    field = field || [];
    if (typeof field === 'string') {
        field = [field];
    }

    var assertValue = value;
    field.forEach(function (fieldName) {
        if (assertValue) {
            assertValue = assertValue[fieldName];
        } else {
            throw new Error('Assertion error: no such field: value.' + field.join(','));
        }
    });
    return assertValue;
}

function argsAsArray(args) {
    return Array.prototype.splice.call(args, 0);
}

/******** Functionality ******/
/**
 * Asserts a condition on a value. if the value passes the assertion, it is returned, otherwise an error is thrown
 * @param value {Object}
 * @param field {Array? | String?} a field name to assert and return. if an array is used, each item is a field of the previous field value.
 * Example: field = ['first', 'second', 'third'] means value['first']['second']['third'] is asserted and returned.
 * default is undefined
 * @param assertion {Function?} an assertion function. default is assert.defined
 * @param message {String} an error message if the assertion fails
 */
function assert(value, field, assertion, message) {
    if (!message) {
        if (typeof assertion === 'string') {
            message = assertion;
            assertion = assert.defaultAssert;
        } else {
            if (typeof field === 'string') {
                message = field;
                field = undefined;
                assertion = assertion || assert.defaultAssert;
            } else {
                throw new Error('Invalid assertion: no message defined');
            }
        }
    }

    if(!assertion) {
        throw new Error('Assert internal error. arguments: <' + argsAsArray(arguments).join(',') + '>');
    }

    value = getValueToAssert(field, value);

    if (assertion(value)) {
        return value;
    } else {
        throw new Error(message);
    }
}

assert.defined = function (value) {
    return value !== undefined;
};

assert.defaultAssert = assert.defined;

assert.truethy = function (value) {
    return !!value;
};

assert.inRange = function (min, max, excludeBoundaries) {
    return function inRange(value) {
        return excludeBoundaries ?
            value > min && value < max :
            value >= min && value <= max;
    };
};

assert.greaterThan = function (greaterThanValue) {
    return function greaterThan(value) {
        return value > greaterThanValue;
    };
};

assert.lessThan = function (lessThanValue) {
    return function lessThan(value) {
        return value < lessThanValue;
    };
};

assert.contains = function () {
    var containedValues = argsAsArray(arguments);

    return function contains(value) {
        function itemIsContainedInValue(item) {
            return value.indexOf(item) > -1;
        }

        return containedValues.every(itemIsContainedInValue);
    };
};

assert.containsSome = function () {
    var containedValues = argsAsArray(arguments);

    return function contains(value) {
        function itemIsContainedInValue(item) {
            return value.indexOf(item) > -1;
        }

        return containedValues.some(itemIsContainedInValue);
    };
};

assert.allOf = function () {
    var assertions = argsAsArray(arguments);
    return function allOf(value) {
        function assertionPasses(assertion) {
            return assertion(value);
        }

        return assertions.every(assertionPasses);
    };
};

assert.anyOf = function () {
    var assertions = argsAsArray(arguments);
    return function allOf(value) {
        function assertionPasses(assertion) {
            return assertion(value);
        }

        return assertions.some(assertionPasses);
    };
};


assert.not = function (assertion) {
    return function not(value) {
        return !assertion(value);
    };
};

module.exports = assert;
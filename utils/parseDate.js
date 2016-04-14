var exports = module.exports;


// Parses date strings from template. Handles special cases like 'today'.
// Returns a Date object.
exports.parseDateString = function (str) {
    "use strict";
    var date = Date.parse(str);
    if (str === "today") {
        date = Date.today();
        date.setTimeToNow().addSeconds(-1);
    }
    return date;
}

// TODO
exports.parseRepetitionToDates = function (rep){
    return new Date.parse("next " + rep);
};
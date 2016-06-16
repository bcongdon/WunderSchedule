require('datejs');
var log = require("./logging.js").log;


var exports = module.exports;


// Parses date strings from template. Handles special cases like 'today'.
// Returns a Date object.
exports.parseDateString = function (str) {
    "use strict";
    var date = Date.parse(str);
    if (str === "today") {
        // Weirdness caused by Wunderlist timezoning stuff?
        date = Date.parse("today at 12pm");
    }
    if(!date){
        log.warn("Could not parse \"" + str + "\" to a date.")
    }
    return date;
}

exports.parseRepetitionToDates = function (rep){
    return new Date.parse("next " + rep);
};
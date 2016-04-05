/*
    parseTaskTemplate

    Handles parsing of task 'templates' as defined in the tasks of the
    scheduled list.
*/

var note = require('./note.js');
require('datejs');

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

// Parses the 'note' of a template tasks. Extracts keywords like 'start-time',
// etc. and returns a dictionary.
function parseContentString(str) {
    "use strict";
    var template_dict = {};
    var lines = str.split(/\r?\n/);
    var i = 0, dateStr = "";
    for (i = 0; i < lines.length; i += 1) {
        if (lines[i].indexOf("start-time:") === 0) {
            dateStr = lines[i].replace(/^start-time:/, '');
            // //Remove whitespace
            dateStr = dateStr.replace(/\s+/, "");
            template_dict.start_time_str = dateStr;
        } else if (lines[i].indexOf("due-date:") === 0) {
            dateStr = lines[i].replace(/^due-date:/, '');
            //Remove whitepsace
            dateStr = dateStr.replace(/\s+/, "");
            template_dict.due_date = exports.parseDateString(dateStr);
        } else if (lines[i].indexOf("starred") === 0) {
            template_dict.starred = true;
        } else if (lines[i].indexOf("repeat-every: ") === 0) {
            template_dict.repeat_every = lines[i].replace(/^repeat-every: /, '');
        } else if (lines[i].indexOf("note: ") === 0) {
            template_dict.note = lines[i].replace(/^note: /, '');
        } else if (lines[i].indexOf("list: ") === 0) {
            template_dict.list = lines[i].replace(/^list: /, '');
        }
    }

    // If no due date specified, default to today
    if(!template_dict.due_date){
        template_dict.due_date = exports.parseDateString("today");
    }
    
    if(template_dict.start_time_str) {
        template_dict.start_time = Date.parse(template_dict.due_date.toString("yyyy/MM/dd") + template_dict.start_time_str)
    }
    return template_dict;
}

exports.templateToNoteString = function (template) {
    var contentStr = ""
    if (template.repeat_every) contentStr += "repeat-every: " + template.repeat_every + "\n";
    if (template.starred) contentStr += "starred" + "\n";
    if (template.list) contentStr += "list: " + template.list + "\n";
    if (template.note) contentStr += "note: " + template.note + "\n";
    if (template.due_date) contentStr += "due-date: " + template.due_date.toString('yyyy/MM/dd HH:mm:ss') + "\n";
    if (template.start_time) contentStr += "start-time: " + template.due_date.toString('HH:mm:ss') + "\n";
    return contentStr
}

// Takes a template dictionary and uses it to update the task that it came
// from. (i.e. Once a repeating task has run to update next start
// date)
exports.pushTemplateUpdate = function (template) {
    var template_string = exports.templateToNoteString(template);
    note.updateNoteContent(template_string, template.task_id);
};


// TODO
function parseRepetitionToDates(rep){
    return new Date.parse("next " + rep);
};

exports.updateTemplateWithRepeat = function (task_template){
    var rep_str = task_template.repeat_every;
    if (rep_str) {
        //Split by comma, remove whitespace
        var rep_args = rep_str.split(",");
        var i = 0; 
        var rep_dates = [];
        var currDate;
        for (i = 0; i < rep_args.length; i += 1){
            currDate = parseRepetitionToDates(rep_args[i])
            if(currDate.toString().length > 15) rep_dates.push(currDate);
        }
        rep_dates.sort();
        if(!rep_dates[0]) return null;
        task_template.start_time = rep_dates[0];
        return task_template;
    };
    return null;
};

// Extracts templates from a given list. Tries to extract template dict from
// each task in list, and calls back with a list of template dictionaries.
exports.extractTemplateTasks = function (list_id, cb) {
    "use strict";
    note.getNoteList(list_id, function (res_body) {
        var templates = [], new_template = "";
        var i = 0;
        for (i = 0; i < res_body.length; i += 1) {
            if (res_body[i].content) {
                new_template = parseContentString(res_body[i].content);
                new_template.task_id = res_body[i].task_id;
                //console.log(res_body);
                templates.push(new_template);
            }
        }
        cb(templates);
    });
};
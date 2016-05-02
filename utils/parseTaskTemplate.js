"use strict";
/*
    parseTaskTemplate

    Handles parsing of task 'templates' as defined in the tasks of the
    scheduled list.
*/

var note = require('./note.js');
var task = require('./task.js');
var parseDate = require('./parseDate');
var log = require("./logging.js").log;
require('datejs');

var exports = module.exports;

var start_time_strings = ['start-time:',
                            's:',
                            'start:'];

var due_date_strings = ['due-date:',
                          'due:',
                          'd:'];

var repeat_every_strings = ['repeat-every:',
                              'repeat:',
                              'r:'];

var starred_strings = ['starred',
                       'star'];

var note_strings = ['note',
                    'n'];

var list_strings = ['list',
                    'l']


// Line starts with one of the strings in strings
exports.startsWithOneOf = function(line, strings){
    var retVal = false;
    strings.forEach(function(prefix){
        if(line.indexOf(prefix) === 0){
            retVal = true;
        }
    });
    return retVal;
}

// Removes prefix and following whitespace from str
exports.removePrefix = function (str) {
    //var re = new RegExp(/:(\s+)?(\S+)/)
    var re = new RegExp(/^[^:]*:\s*/);
    var match = str.replace(re,"")
    return match
}

// Parses the 'note' of a template tasks. Extracts keywords like 'start-time',
// etc. and returns a dictionary.
exports.parseContentString = function(str) {
    "use strict";
    var template_dict = {};
    var lines = str.split(/\r?\n/);
    var i = 0, dateStr = "";
    for (i = 0; i < lines.length; i += 1) {
        if (exports.startsWithOneOf(lines[i], start_time_strings)) {
            template_dict.start_time_str = exports.removePrefix(lines[i]);
        } else if (exports.startsWithOneOf(lines[i], due_date_strings)) {
            dateStr = exports.removePrefix(lines[i]);
            template_dict.due_date = parseDate.parseDateString(dateStr);
        } else if (exports.startsWithOneOf(lines[i], starred_strings)) {
            template_dict.starred = true;
        } else if (exports.startsWithOneOf(lines[i], repeat_every_strings)) {
            template_dict.repeat_every = exports.removePrefix(lines[i])
        } else if (exports.startsWithOneOf(lines[i], note_strings)) {
            template_dict.note = exports.removePrefix(lines[i])
        } else if (exports.startsWithOneOf(lines[i], list_strings)) {
            template_dict.list = exports.removePrefix(lines[i])
        }
    }

    // If no due date specified, default to today
    if(!template_dict.due_date){
        template_dict.due_date = parseDate.parseDateString("today at 12pm");
    }
    
    if(template_dict.start_time_str) {
        template_dict.start_time = Date.parse(template_dict.due_date.toString("yyyy/MM/dd") + " " + template_dict.start_time_str)
    }

    return template_dict;
}

exports.templateToNoteString = function (template) {
    var contentStr = ""
    if (template.repeat_every) contentStr += "repeat-every: " + template.repeat_every + "\n";
    if (template.starred) contentStr += "starred\n";
    if (template.list) contentStr += "list: " + template.list + "\n";
    if (template.note) contentStr += "note: " + template.note + "\n";
    if (template.due_date) contentStr += "due-date: " + template.due_date.toString('yyyy/MM/dd') + "\n";
    if (template.start_time) contentStr += "start-time: " + new Date(template.start_time).toString('hh:mm tt') + "\n";
    
    return contentStr
}

// Takes a template dictionary and uses it to update the task that it came
// from. (i.e. Once a repeating task has run to update next start
// date)
exports.pushTemplateUpdate = function (template) {
    var template_string = exports.templateToNoteString(template);
    note.updateNoteContent(template_string, template.task_id);
};


exports.updateTemplateWithRepeat = function (task_template){
    "use strict";
    var rep_str = task_template.repeat_every;
    if (rep_str) {
        var old_due_time = task_template.due_date;
        //Split by comma, remove whitespace
        var rep_args = rep_str.split(",");
        var i = 0; 
        var rep_dates = [];
        var currDate;
        for (i = 0; i < rep_args.length; i += 1){
            currDate = parseDate.parseRepetitionToDates(rep_args[i])
            if(currDate.toString().length > 15) rep_dates.push(currDate);
        }

        // Sorts repetition dates in 'ascending' order
        rep_dates.sort(function(a,b){
            return a - b;
        });

        // No 'earliest' date
        if(!rep_dates[0]) {
            task.getTask(task_template.task_id, function(task){
                log.warn("Couldn't parse repeat for task template with name '" + task.title + "'");
            });
            return null
        }
        task_template.due_date = rep_dates[0];
        if(old_due_time){
                task_template.due_date = new Date.parse(
                task_template.due_date.toString("yyyy/MM/dd") + " " +
                old_due_time.toString("hh:mm tt")
            );
        }
        return task_template;
    };
    task.getTask(task_template.task_id, function(task){
        log.error("Template with name '" + task.title + "' does not have a repetition defined.")
    });
    return null;
};

// Extracts templates from a given list. Tries to extract template dict from
// each task in list, and calls back with a list of template dictionaries.
exports.extractTemplateTasks = function (list_id, cb) {
    "use strict";
    note.getNoteList(list_id, function (res_body) {
        var templates = [], new_template = "";
        var i = 0;
        var warn = function(task){
            log.warn("Task with name '" + task.title + "' has no start time!")
        }
        for (i = 0; i < res_body.length; i += 1) {
            
            if (res_body[i].content) {
                new_template = exports.parseContentString(res_body[i].content);
                new_template.task_id = res_body[i].task_id;
                if(!('start_time' in new_template)){
                    task.getTask(new_template.task_id, warn);
                }
                templates.push(new_template);
            }
        }
        cb(templates);
    });
};
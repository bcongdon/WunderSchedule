"use strict";
var api = require('./api.js');
var log = require("./logging.js").log;


var exports = module.exports;

exports.getTask = function (id, cb) {
    'use strict';
    api({url: '/tasks/' + id}, function (err, res, body) {
        if (err) {
            log.error("Error getting task!")
            log.error(err);
            throw err;
        }
        cb(body);
    });
};

exports.deleteTask = function (id) {
    'use strict';
    exports.getTask(id, function (task) {
        api.del({url: '/tasks/' + id, qs: {revision: task.revision}}, function (err, res, body) {
            if (err) {
                log.error("Error deleting task!");
                log.error(err);
                throw err;
            }
        });
    });
};

exports.createTask = function (list_id, title, due_date, starred, reminder) {
    'use strict';
    due_date = due_date || "";
    starred = starred || false;
    var task_dict = {
        list_id: list_id,
        title: title,
        due_date: due_date,
        starred: starred,
    };
    api.post({url: '/tasks', body: task_dict}, function (err, res, body) {
        if (err) {
            log.error("Error creating task!")
            log.error(err);
            throw err;
        }
        // Task addition was successful and we have a reminder to log
        else if(reminder){
            var reminder_dict = {
                task_id: body.id,
                date: reminder.toString()
            }
            api.post({url: '/reminders', body: reminder_dict}, function(err, res, body){
                if(err) {
                    log.error('Error creating reminder!');
                    log.error(err);
                    throw err;
                }
            });
        }
    });
};

// Calls back with list of tasks for given list_id
exports.getTaskList = function(list_id, cb){
    api({url: '/tasks', qs: {list_id:list_id}},function(err,res,body){
        if(err) {
            log.error("Error getting task list!");
            log.error(err);
            throw err;
        }
        cb(body);
    });
}

exports.logTask = function(task_id, str, level){
    str = str || "Updated!";
    level = level || "info"
    exports.getTask(task_id, function(ret_task){
        log.log(level, "'" + ret_task.title + "': " + str);
    });
}
var api = require('./api.js');

var exports = module.exports;

exports.getTask = function (id, cb) {
    'use strict';
    api({url: '/tasks/' + id}, function (err, res, body) {
        if (err) {
            process.exit(1);
        }
        cb(body);
    });
};

exports.deleteTask = function (id) {
    'use strict';
    exports.getTask(id, function (task) {
        console.log(task);
        api.del({url: '/tasks/' + id, qs: {revision: task.revision}}, function (err, res, body) {
            if (err) {
                process.exit(1);
            }
        });
    });
};

exports.createTask = function (list_id, title, due_date, starred) {
    'use strict';
    due_date = due_date || "";
    starred = starred || false;
    var task_dict = {
        list_id: list_id,
        title: title,
        due_date: due_date,
        starred: starred
    };
    api.post({url: '/tasks', body: task_dict}, function (err, res, body) {
        if (err) {
            process.exit(1);
        }
        console.log(body);
    });
};

// Calls back with list of tasks for given list_id
exports.getTaskList = function(list_id, cb){
    api({url: '/tasks', qs: {list_id:list_id}},function(err,res,body){
        if(err) process.exit(1);
        cb(body);
    });
}
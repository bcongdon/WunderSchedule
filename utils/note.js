/*
    Note

    Handles functions specific to the Note endpoint of Wunderlist
*/
var api = require('./api.js')

var exports = module.exports;

// Calls back with a list of notes for given list_id
exports.getNoteList = function(list_id, cb){
    api({url: '/notes', qs: {list_id: list_id}}, function(err,res,body){
        cb(body);
    });
}

exports.getNoteFromTask = function (task_id, cb){
    api({url: '/notes', qs: {task_id: task_id}}, function (err,res,body) {
        if (err) {
            console.log("Error getting note from task")
            console.log(err);
            process.exit(1);
        };
        cb(body[0]);
    });
};

exports.updateNoteContent = function (content, task_id) {
    exports.getNoteFromTask(task_id, function (note) {
        console.log(note);
        api.patch({url: '/notes/' + note.id, body: 
            {revision: note.revision, content: content}}, function (err, res, body) {
                // console.log(body);
            });
    });
};

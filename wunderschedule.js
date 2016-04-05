"use strict";
var scheduler = require('node-schedule');

var api = require('./utils/api.js');
var list_api = require('./utils/list.js');
var parse = require('./utils/parseTaskTemplate.js');
var task = require("./utils/task.js");


var scheduled = "scheduled";

// Calls back with the list_id of "scheduled" list.
// Makes the "scheduled" list if not found.
function getScheduledListID(cb) {
    list_api.getListID(scheduled, function (list_id) {
        if(!list_id) {
            makeScheduled(cb);
        }
        cb(list_id);
    });
}

// Makes a list called "scheduled" and calls back with the list_id
function makeScheduled(cb) {
    api.post({url: '/lists', body: {"title": scheduled}}, function (err, res, body) {
        if(err) {
            process.exit(1);
        }
        cb(body.id);
    });
}

// Appends given text to the note associated with the given task_id
function appendNote(task_id, text){
    api({url: '/notes', qs:{task_id: task_id}},function(err,res,body){
        if(body.content){
            var contentStr = body.content + text;
            api.post({url:'/notes/:' + id ,qs:{revision: id, content: contentStr}});
        }
    });
}

// Creates a task with the properties (due_date, list membership, starred
// etc.) of the given template dictionary. Defaults list membership to 'inbox'
function createTaskFromTemplate(template){
    var list_name = template.list || "inbox";
    list_api.getListID(list_name, function(list_id){
        task.getTask(template.task_id,function(template_task){
            task.createTask(list_id, template_task.title, template.due_date, template.starred);
        })
    })
}

// Accepts a list of templates. For each template, we see if the start_date was
// before 'now'. If that's the case, create a task from the template. Once
// done, delete the template if it doesn't repeat, otherwise increment the
// start/due dates and update the template.
function handleTemplates(templates){
    var i = 0;
    var now = new Date();

    for(i = 0; i < templates.length; i++){
        var curr = templates[i];
        //Validate that template has start_date
        if(curr.start_time){
            //See if start_date is before now
            if(curr.start_time <= now){
                //Need to create task from template
                console.log("Creating task for id " + curr.task_id);
                createTaskFromTemplate(curr);
                
                //If not a repeating task, delete the spawning template
                if(!curr.repeat_every){
                    console.log("Deleting non-repeating task template. (" + curr.task_id + ")")
                    task.deleteTask(curr.task_id);
                } else {
                    //Otherwise, set start_date to next occurance
                    template = parse.updateTemplateWithRepeat(curr);

                    if(template) parse.pushTemplateUpdate(template);
                }
            }
        }
    }
}

// Main checking function of WunderSchedule.
// 1. Gets the list_id of "scheduled"
// 2. Extracts templates from the notes in that list.
// 3. Handles each template, which creates tasks if necessary.
function wunderSchedule(){
    getScheduledListID(function(list_id){
        parse.extractTemplateTasks(list_id,function(templates){
            console.log("Loaded " + templates.length + " task templates.")
            // console.log(templates)
            handleTemplates(templates);
        });
    })
}

console.log("[WunderSchedule] Running initial check.")
wunderSchedule();

//Every 1 minute
scheduler.scheduleJob("* * * * *", function(){
    console.log("[WunderSchedule] Running scheduled check at " + new Date().toString("yyyy-mm-dd HH:mm:ss"));

    wunderSchedule();
})

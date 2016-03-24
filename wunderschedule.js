var http = require('http');
var request = require('request');
var scheduler = require('node-schedule');

var api = require('./utils/api.js');
var list_api = require('./utils/list.js')
var parse = require('./utils/parse_task_template.js')
var task = require("./utils/task.js");


var scheduled = "scheduled"
const check_interval = 1

function getScheduledListID(cb){
	list_api.getListID(scheduled, function(list_id){
		if(!list_id){
			makeScheduled(cb);
		}
		cb(list_id)
	})
}
	
function makeScheduled(cb){
		api.post({url: '/lists', body: {"title": scheduled}}, function(err, res, body){
		if(err) process.exit(1);
		cb(body.id);
	})
}

function getRemindersFromTask(id, cb){
	api({url: '/reminders', qs: {task_id: id}}, function(err,res,body){
		cb(body);
	});
}

function appendNote(id, text){
	api({url: '/notes', qs:{task_id: id}},function(err,res,body){
		if(body.content){
			var contentStr = body.content + text;
			api.post({url:'/notes/:' + id ,qs:{revision: id, content: contentStr}})
		}
	})
}

function deleteReminder(id){
	api.delete({url:'/reminders', qs:{task_id: id}}, function(err,res,body){
		if(err) process.exit(1);
	})
}

function createTaskFromTemplate(template){
	var list_name = template.list || "inbox";
	console.log(list_name)
	list_api.getListID(list_name, function(list_id){
		task.getTask(template.task_id,function(template_task){
			console.log(template_task)
			task.createTask(list_id, template_task.title, template.due_date, template.starred);
		
			//If not a repeating task, delete the spawning template
			if(!template.repeat_every){
				task.deleteTask(template.task_id);
			}
		})
	})
}

function handleTemplates(templates){
	var i = 0;
	var now = new Date();
	var startInterval = new Date();
	startInterval.addMinutes(-1);

	for(i = 0; i < templates.length; i++){
		var curr = templates[i];
		//Validate that template has start_date
		if(curr.start_date){
			//See if start_date is before now and after "check_interval" minutes ago
			console.log(curr.start_date);
			console.log(now);
			console.log(startInterval);
			if(curr.start_date <= now && curr.start_date > startInterval){
				//Need to create task from template
				console.log("Need to create " + curr.task_id);
				createTaskFromTemplate(curr);
			}
		}
	}
}

function wunderSchedule(){
	getScheduledListID(function(list_id){
		parse.extractTemplateTasks(list_id,function(templates){
			console.log(templates);
			handleTemplates(templates);
		});
	})
}

//Every 1 minute
scheduler.scheduleJob("0 * * * * *", function(){
	wunderSchedule();
})

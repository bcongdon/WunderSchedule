var http = require('http');
var request = require('request')

var api = require('./utils/api.js');
var list_api = require('./utils/list.js')
var parse = require('./utils/parse_task_template.js')

var scheduled = "scheduled"

function getScheduledListID(cb){
	api('/lists',function(err, res, body){

		var i = 0;
		for(i = 0; i < body.length; i++){
			if (body[i].title === scheduled) {
				cb(body[i].id);
				return;
			}
		}

		makeScheduled(cb);
	});
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
		console.log(body);
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

getScheduledListID(function(res){
	parse.scheduledListToJSON(res,function(res2){
		console.log(res2);
	});
})
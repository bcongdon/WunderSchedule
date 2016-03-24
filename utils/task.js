var api = require('./api.js');

var exports = module.exports;

exports.getTask = function(id,cb){
	api({url:'/tasks/' + id},function(err,res,body){
		if(err) process.exit(1);
		cb(body);
	})
}

exports.deleteTask = function(id){
	exports.getTask(id, function(task){
		console.log(task);
		api.del({url:'/tasks/' + id, qs:{revision:task.revision}},function(err, res, body){
			if(err) process.exit(1);
		})
	})
}

exports.createTask = function(list_id, title, due_date, starred){
	due_date = due_date || ""
	starred = starred || false
	task_dict = {
		list_id: list_id,
		title: title,
		due_date: due_date,
		starred: starred
	}
	api.post({url: '/tasks', body: task_dict}, function(err, res, body){
		if(err) process.exit(1);
		console.log(body);
 	})
}
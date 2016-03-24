var api = require("./api.js")

var exports = module.exports

exports.getTaskList = function(list_id, cb){
	console.log(id);
	api({url: '/tasks', qs: {list_id:list_id}},function(err,res,body){
		if(err) process.exit(1);
		cb(body);
	});
}

exports.getNotesFromList = function(list_id, cb){
	api({url: '/notes', qs: {list_id: list_id}}, function(err,res,body){
		cb(body);
	});
}
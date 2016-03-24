var api = require("./api.js")

var exports = module.exports

exports.getTaskList = function(list_id, cb){
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

exports.getListID = function(list_name, cb){
	api('/lists',function(err, res, body){

		var i = 0;
		for(i = 0; i < body.length; i++){
			if (body[i].title === list_name) {
				cb(body[i].id);
				return;
			}
		}
		cb(false);
	});
}
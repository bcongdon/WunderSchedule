var api = require('./api.js')
var note = require('./note.js')

var exports = module.exports;

function parseContentString(str){
	var template_dict = {};
	var lines = str.split(/\r?\n/);
	var i = 0; 
	for(i = 0; i < lines.length; i++){
		if(lines[i].startsWith("start-date:")){
			template_dict.start_date = lines[i].replace(/^start-date:/, '');
		}
		else if(lines[i].startsWith("due-date:")){
			template_dict.due_date = lines[i].replace(/^due-date:/, '');
		}
		else if(lines[i].startsWith("starred:")){
			template_dict.starred = lines[i].replace(/^starred:/, '');
		}
		else if(lines[i].startsWith("repeat-every:")){
			template_dict.repeat_every= lines[i].replace(/^repeat-every:/, '');
		}
		else if(lines[i].startsWith("note:")){
			template_dict.note = lines[i].replace(/^note:/, '');
		}
		else if(lines[i].startsWith("list:")){
			template_dict.list = lines[i].replace(/^list:/, '');
		}
	}
	return template_dict;
}

exports.scheduledListToJSON = function(list_id, cb){
	note.getNotesFromList(list_id, function(res_body){
		var templates = []
		var i = 0;
		for(i = 0; i < res_body.length; i++){
			if(res_body[i].content){
				var new_template = parseContentString(res_body[i].content);
				new_template.task_id = res_body[i].task_id;
				templates.push(new_template);
			}
		}
		cb(templates);
	})
}
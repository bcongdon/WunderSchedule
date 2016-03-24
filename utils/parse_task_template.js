var api = require('./api.js')
var note = require('./note.js')
require('datejs')

var exports = module.exports;

function parseDateString(str){
	var date = Date.parse(str);
	if(str === "today"){
		date = Date.today().setTimeToNow().addMinutes(5);
	}
	return date;
}

//Parses the 'note' of a template tasks
function parseContentString(str){
	var template_dict = {};
	var lines = str.split(/\r?\n/);
	var i = 0; 
	for(i = 0; i < lines.length; i++){
		if(lines[i].startsWith("start-date:")){
			var dateStr = lines[i].replace(/^start-date:/, '');
			//Remove whitepsace
			dateStr = dateStr.replace(/\s+/, "");
			template_dict.start_date = parseDateString(dateStr);
		}
		else if(lines[i].startsWith("due-date:")){
			var dateStr = lines[i].replace(/^due-date:/, '');
			//Remove whitepsace
			dateStr = dateStr.replace(/\s+/, "");
			template_dict.due_date = parseDateString(dateStr);
		}
		else if(lines[i].startsWith("starred")){
			template_dict.starred = true
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

exports.extractTemplateTasks = function(list_id, cb){
	note.getNotesFromList(list_id, function(res_body){
		var templates = []
		var i = 0;
		for(i = 0; i < res_body.length; i++){
			if(res_body[i].content){
				var new_template = parseContentString(res_body[i].content);
				new_template.task_id = res_body[i].task_id;
				console.log(res_body);
				templates.push(new_template);
			}
		}
		cb(templates);
	})
}
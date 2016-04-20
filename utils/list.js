/*
	List

	Handles functions specific to the List endpoint of Wunderlist
*/

var api = require("./api.js")
var log = require("./logging.js").log;


var exports = module.exports

// Calls back with list_id for given list_name if the list exists, otherwise false
exports.getListID = function(list_name, cb){
	api('/lists',function(err, res, body){
		if(err){
			log.error("Error getting list ID!")
            log.error(err)
            process.exit(1);
		}
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
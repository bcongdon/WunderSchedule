var api = require('./api.js')

var exports = module.exports;

exports.getNotesFromList = function(list_id, cb){
	api({url:'/notes', qs:{list_id:list_id}}, function(err,res,body){
		cb(body);
	});
}
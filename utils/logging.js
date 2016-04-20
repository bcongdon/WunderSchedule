require('datejs');
var fs = require('fs')
var Log = require('log');
var log = new Log('debug', fs.createWriteStream('wunderschedule.log', {'flags': 'a'}));
var reader = new Log('debug', fs.createReadStream('wunderschedule.log'));
var rotate = require('log-rotate');


rotate('./wunderschedule.log', { count: 3 }, function(err) {
    if(err){
        console.log(err)
    }
});

reader.on('line', function(line){
  // Only print logs to console if they've been added in last 5 sec
    if(line.date.compareTo(new Date().addSeconds(-5)) < 0)
        return
    console.log("[Wunderschedule] " + line.levelString + ": " + line.msg);
})

exports.log = log;
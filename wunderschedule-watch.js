var wunderSchedule = require('./index.js');
var log = require("./utils/logging.js").log;
var scheduler = require('node-schedule');

log.info("Setup and watching scheduled list.")
var currSeconds = new Date().getSeconds();

// Run every 1 minute
scheduler.scheduleJob(currSeconds + " * * * * *", function(){
    log.info("Running scheduled check at " + new Date().toString("yyyy-MM-dd HH:mm:ss"));
    wunderSchedule();
})

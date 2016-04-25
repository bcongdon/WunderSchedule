"use strict"

require('datejs');
var fs = require('fs')

// Rotate old log file
var rotate = require('log-rotate');
rotate('./wunderschedule.log', { count: 3 }, function(err) {
    if(err){
        console.log(err)
    }
});

// Create winston and configure it to log to file
var winston = require('winston');
var log = new(winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            formatter: function(options) {
                // Return string will be passed to logger.
                return '[WunderSchedule] '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
              (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
            }
        }),
        new (winston.transports.File)({ filename: 'wunderschedule.log' })
    ]
});

// Direct uncaught exceptions to error logs
process.on('uncaughtException', function (error) {
   log.error(error.stack);
});

exports.log = log;
var app = require('commander')

app
    .version('0.0.1')
    .command('auth', 'Authenticate WunderSchedule')
    .command('run', 'Checks for new scheduled tasks', {isDefault: true})
    .parse(process.argv);
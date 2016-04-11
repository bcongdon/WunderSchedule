#!/usr/bin/env node

var pkg = require('./package.json');

var app = require('commander')

app
    .version(pkg.version)
    .command('auth', 'Authenticate WunderSchedule')
    .command('run', 'Checks for new scheduled tasks', {isDefault: true})
    .parse(process.argv);

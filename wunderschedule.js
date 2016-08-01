#!/usr/bin/env node

var pkg = require('./package.json');

var app = require('commander');

app
    .version(pkg.version)
    .command('auth',  'Authenticates WunderSchedule')
    .command('check', 'Runs a single check of the "scheduled" list')
    .command('watch', 'Watches your "scheduled" list and creates new tasks when necessary', {isDefault: true})
    .command('add',   'Create a task template for WunderSchedule')
    .parse(process.argv);

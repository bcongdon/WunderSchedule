'use strict';

var inquirer = require('inquirer');

var request = require('request');

var Configstore = require('configstore');
var pkg = require('./package.json');
var config = new Configstore(pkg.name);

var prompts = [
  {
    name: 'client_id',
    message: 'CLIENT ID',
    validate: function (input) {
      return input.length > 0;
    }
  },
  {
    name: 'access_token',
    message: 'ACCESS TOKEN',
    validate: function (input) {
      return input.length > 0;
    }
  }
];

console.log('Please create a Wunderlist Application here: https://developer.wunderlist.com/apps/new');
console.log('Record your client_id and access_token, then enter them below.');
inquirer.prompt(prompts).then(function(answers) {
  request.get({
    json: true,
    url: 'https://a.wunderlist.com/api/v1/user',
    headers: {
      'X-Access-Token': answers.access_token,
      'X-Client-ID': answers.client_id
    }
  }, function (err, res, body) {
    if(err || body.error || body.invalid_request || body.unauthorized){
      console.log('ERROR: Could not authenticate with given credentials.');
    }
    else{
      config.set('client_id', answers.client_id);
      config.set('access_token', answers.access_token);
      config.set('authentication_time', new Date());
      console.log('Credentials saved.');
    }
  });
});
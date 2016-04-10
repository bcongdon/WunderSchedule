var app = require('commander')
var inquirer = require('inquirer')

const Configstore = require('configstore');
const pkg = require('./package.json');
const config = new Configstore(pkg.name, {foo: 'bar'});


var prompts = [
  {
    name: 'client_id',
    message: 'CLIENT ID',
    validate: function (input) {
      return input.length > 0
    }
  },
  {
    name: 'access_token',
    message: 'ACCESS TOKEN',
    validate: function (input) {
      return input.length > 0
    }
  }
]

console.log("Please create a Wunderlist Application and input your client_id and access_token below.")
inquirer.prompt(prompts).then(function(answers) {
    config.set("client_id", answers.client_id);
    config.set("access_token", answers.access_token);
});
'use strict';

require('datejs');
var inquirer = require('inquirer');

var prompts = [
  {
    name: 'name',
    message: 'Task Name',
    validate: function (input) {
      return input.length > 0;
    }
  },
  {
    name: 'due_date',
    message: 'Due Date',
    validate: function (input) {
      try {
        var d = new Date.parse(input);
        return d.getTime() > 0;
      }
      catch(e) {
        return '\'' + input + '\' is not a date.';
      }
    }
  },
  {
    name: 'start_time',
    message: 'Task Start Time',
    validate: function (input) {
      return input.length > 0;
    }
  },
  {
    name: 'repeat_every',
    message: 'Repeat Every',
    validate: function (input) {
      return input.length > 0;
    }
  }
];

inquirer.prompt(prompts).then(function(answers) {
  console.log(answers);
});

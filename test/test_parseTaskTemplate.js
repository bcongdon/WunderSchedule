var assert = require('assert');
var expect = require('chai').expect;
require('datejs');


var parse = require('./../utils/parseTaskTemplate.js');

describe('parseTaskTemplate.js', function () {
  
  describe('templateToNoteString()', function () {
    it('should return empty str with empty template', function () {
      expect(parse.templateToNoteString({})).to.equal('');
    });

    it('should properly format starred', function (){
      var template = {starred: true};
      expect(parse.templateToNoteString(template)).to.equal('starred\n');
    });

    it('should properly format list', function (){
      var template = {list: 'test'};
      expect(parse.templateToNoteString(template)).to.equal('list: test\n');
    });

    it('should properly format note', function (){
      var template = {note: 'hello world'};
      expect(parse.templateToNoteString(template)).to.equal('note: hello world\n');
    });
    it('should properly format due_date, repeat_every, and start_time', function (){
      var testDate = Date.parse('1/1/2020');
      var testTime = new Date.parse('4pm');
      var template = {due_date: testDate, start_time: testTime, repeat_every: 'day'};
      var correct = 'repeat-every: day\ndue-date: 2020/01/01\nstart-time: 04:00 PM\n';
      expect(parse.templateToNoteString(template)).to.equal(correct);
    });

    it('should properly format reminder time', function() {
      var template = { reminder: new Date.parse('4:50am') };
      var correct = 'reminder: 04:50 AM\n';
      expect(parse.templateToNoteString(template)).to.equal(correct);
    });
  });

  describe('parseContentString()', function() {
    // Due Date Tests
    it('should extract due-date correctly', function() {
      var contentStr = 'due-date: 3/14/16';
      var parsed = new Date.parse('3/14/16');
      expect(parse.parseContentString(contentStr).due_date.toString()).to.equal(parsed.toString());
    });
    it('should extract due-date with shortened tags', function() {
      var parsed = new Date.parse('3/14/16');

      var contentStr = 'due: 3/14/16';
      expect(parse.parseContentString(contentStr).due_date.toString()).to.equal(parsed.toString());

      contentStr = 'd: 3/14/16';
      expect(parse.parseContentString(contentStr).due_date.toString()).to.equal(parsed.toString());
    });
    it('should default due-date to today', function() {
      var contentStr = 'start-time: 5pm';
      var parsed = new Date.parse('today at 12pm');
      var correct_start = new Date.parse('5pm');
      expect(parse.parseContentString(contentStr).due_date.toString()).to.equal(parsed.toString());
      expect(parse.parseContentString(contentStr).start_time.toString()).to.equal(correct_start.toString());
    });

    // Start Time Tests
    it('should extract start-time correctly', function() {
      var contentStr = 'start-time: 5pm';
      var parsed = new Date.parse('5pm');
      expect(parse.parseContentString(contentStr).start_time.toString()).to.equal(parsed.toString());
    });
    it('should extract start-time with shortened tags', function() {
      var parsed = new Date.parse('5pm');

      var contentStr = 'start: 5pm';
      expect(parse.parseContentString(contentStr).start_time.toString()).to.equal(parsed.toString());

      contentStr = 's: 5pm';
      expect(parse.parseContentString(contentStr).start_time.toString()).to.equal(parsed.toString());
    });

    // Repeat Every Tests
    it('should extract repeat-every', function() {
      var contentStr = 'repeat-every: tuesday';
      var parsed = 'tuesday';
      expect(parse.parseContentString(contentStr).repeat_every).to.equal(parsed);
    });
    it('should extract repeat-every with shortened tags', function() {
      var contentStr = 'repeat: tuesday';
      var parsed = 'tuesday';
      expect(parse.parseContentString(contentStr).repeat_every).to.equal(parsed);

      contentStr = 'r: tuesday';
      expect(parse.parseContentString(contentStr).repeat_every).to.equal(parsed);
    });

    // Misc. Properties tests
    it('should extract note, list, starred', function() {
      var contentStr = 'note: hello\nlist: groceries\nstarred';
      var note = 'hello';
      var list = 'groceries';
      var starred = true;
      var template_dict = parse.parseContentString(contentStr);
      expect(template_dict.note).to.equal(note);
      expect(template_dict.list).to.equal(list);
      expect(template_dict.starred).to.equal(true);
    });
    it('should extract note, list, starred with shortened tags', function(){
      var contentStr = 'n: hello\nl: groceries\nstar';
      var note = 'hello';
      var list = 'groceries';
      var starred = true;
      var template_dict = parse.parseContentString(contentStr);
      expect(template_dict.note).to.equal(note);
      expect(template_dict.list).to.equal(list);
      expect(template_dict.starred).to.equal(true);
    });

    it('should extract reminder time', function() {
      var contentStr = 'reminder: 3pm';
      var template_dict = parse.parseContentString(contentStr);
      expect(template_dict.reminder.toString()).to.equal((new Date.parse('3pm').toString()));
    });

    it('should adjust reminder to due date', function() {
      var contentStr = 'due-date: 1/1/2000; reminder: 4pm';
      var template_dict = parse.parseContentString(contentStr);
      expect(template_dict.reminder.toString()).to.equal((new Date.parse('1/1/2000 4pm').toString()));
    });

    // Formatting tests
    it('should not care about case of prefix', function(){
      var contentStr = 'S: 4pm\nR: day';
      var template_dict = parse.parseContentString(contentStr);
      expect(template_dict.repeat_every).to.equal('day');
      expect(template_dict.start_time.toString()).to.equal((new Date.parse('4pm')).toString());
    });
    it('should not care about whitespace before prefix', function(){
      var contentStr = '   S:    8am\n R: monday';
      var template_dict = parse.parseContentString(contentStr);
      expect(template_dict.repeat_every).to.equal('monday');
      expect(template_dict.start_time.toString()).to.equal((new Date.parse('8am')).toString());
    });
    it('should allow semicolons to separate lines', function(){
      var contentStr = 's:4pm;l:tasks;n:Semicolons work well';
      var template_dict = parse.parseContentString(contentStr);
      expect(template_dict.list).to.equal('tasks');
      expect(template_dict.note).to.equal('Semicolons work well');
      expect(template_dict.start_time.toString()).to.equal((new Date.parse('4pm')).toString());
    });
  });

  describe('removePrefix()', function() {
    it('should remove prefix *without* whitespace following', function(){
      var input = 'my_prefix:value';
      var output = 'value';
      expect(parse.removePrefix(input)).to.equal(output);
    });
    it('should remove prefix *with* whitespace following', function(){
      var input = 'my_prefix:   value';
      var output = 'value';
      expect(parse.removePrefix(input)).to.equal(output);
    });
    it('should remove only prefix and return everything after', function(){
      var input = 'my_prefix:   value1 value2 v a l u e 3';
      var output = 'value1 value2 v a l u e 3';
      expect(parse.removePrefix(input)).to.equal(output);
    });
    it('shouldn\'t remove colons further along in the string', function(){
      var input = 'my_prefix: 06:00 AM';
      var output = '06:00 AM';
      expect(parse.removePrefix(input)).to.equal(output);
    });
  });

  describe('updateTemplateWithRepeat()', function () {
    it('should return null if no repeat could be parsed', function() {
      var template = {repeat_every:'this is not a valid date'};
      expect(parse.updateTemplateWithRepeat(template)).to.equal(null);
    });
    it('should find the earliest next repetition', function() {
      var template = {repeat_every:'tomorrow, today'};
      var today = new Date.parse('today');
      expect(parse.updateTemplateWithRepeat(template).due_date.toString()).to.equal(today.toString());

      template = {repeat_every:'+20 days, +3 days'};
      today = new Date.parse('+3 days');
      expect(parse.updateTemplateWithRepeat(template).due_date.toString()).to.equal(today.toString());

      template = {repeat_every:'+5 months, +3 years'};
      today = new Date.parse('+5 months');
      expect(parse.updateTemplateWithRepeat(template).due_date.toString()).to.equal(today.toString());

      template = {repeat_every:'monday'};
      today = new Date.parse('next monday');
      expect(parse.updateTemplateWithRepeat(template).due_date.toString()).to.equal(today.toString());
    });
    it('should not alter start time',function(){
      var time = new Date.parse('4pm');
      template = {repeat_every:'day', start_time:time};
      expect(parse.updateTemplateWithRepeat(template).start_time).to.equal(time);
    });
  });
});
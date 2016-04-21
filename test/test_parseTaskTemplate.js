var assert = require('assert');
var expect = require('chai').expect;
require('datejs');


var parse = require('./../utils/parseTaskTemplate.js')

describe('parseTaskTemplate.js', function () {
  
  describe('templateToNoteString()', function () {
    it('should return empty str with empty template', function () {
      expect(parse.templateToNoteString({})).to.equal("");
    });

    it('should properly format starred', function (){
      var template = {starred: true};
      expect(parse.templateToNoteString(template)).to.equal("starred\n")
    });

    it('should properly format list', function (){
      var template = {list: 'test'};
      expect(parse.templateToNoteString(template)).to.equal("list: test\n")
    });

    it('should properly format note', function (){
      var template = {note: 'hello world'};
      expect(parse.templateToNoteString(template)).to.equal("note: hello world\n")
    });
    it('should properly format due_date, repeat_every, and start_time', function (){
      var testDate = Date.parse("1/1/2020")
      var template = {due_date: testDate, start_time: testDate, repeat_every: "day"};
      var correct = "repeat-every: day\ndue-date: 2020/01/01\nstart-time: 12:00 AM\n"
      expect(parse.templateToNoteString(template)).to.equal(correct)
    });
  });

  describe('parseContentString()', function() {
    it('should extract due-date correctly', function() {
      var contentStr = "due-date: 3/14/16"
      var parsed = new Date.parse("3/14/16");
      expect(parse.parseContentString(contentStr).due_date.toString()).to.equal(parsed.toString());
    });
    it('should extract start-time correctly', function() {
      var contentStr = "start-time: 5pm"
      var parsed = new Date.parse("5pm");
      expect(parse.parseContentString(contentStr).start_time.toString()).to.equal(parsed.toString());
    });
    it('should default due-date to today', function() {
      var contentStr = "start-time: 5pm"
      var parsed = new Date.parse("today at 12pm")
      expect(parse.parseContentString(contentStr).due_date.toString()).to.equal(parsed.toString());
    });
    it('should extract repeat-every', function() {
      var contentStr = "repeat-every: tuesday";
      var parsed = "tuesday";
      expect(parse.parseContentString(contentStr).repeat_every).to.equal(parsed);
    });
    it('should extract note, list', function() {
      var contentStr = "note: hello\nlist: groceries";
      var note = "hello"
      var list = "groceries"
      var template_dict = parse.parseContentString(contentStr);
      expect(template_dict.note).to.equal(note);
      expect(template_dict.list).to.equal(list);
    });
  });

  describe('removePrefix()', function() {
    it('should remove prefix *without* whitespace following', function(){
      var prefix = 'my_prefix:'
      var input = 'my_prefix:value'
      var output = 'value'
      expect(parse.removePrefix(input, prefix)).to.equal(output);
    });
    it('should remove prefix *with* whitespace following', function(){
      var prefix = 'my_prefix:'
      var input = 'my_prefix:   value'
      var output = 'value'
      expect(parse.removePrefix(input, prefix)).to.equal(output);
    })
  });

  describe('updateTemplateWithRepeat()', function () {
    it('should return null if no repeat could be parsed', function() {
        var template = {repeat_every:"this is not a valid date"};
        expect(parse.updateTemplateWithRepeat(template)).to.equal(null);
    });
    it('should find the earliest next repetition', function() {
        var template = {repeat_every:"tomorrow, today"};
        var today = new Date.parse('today')
        expect(parse.updateTemplateWithRepeat(template).due_date.toString()).to.equal(today.toString());

        template = {repeat_every:"+20 days, +3 days"};
        today = new Date.parse('+3 days')
        expect(parse.updateTemplateWithRepeat(template).due_date.toString()).to.equal(today.toString());

        template = {repeat_every:"+5 months, +3 years"};
        today = new Date.parse('+5 months')
        expect(parse.updateTemplateWithRepeat(template).due_date.toString()).to.equal(today.toString());

        template = {repeat_every:"monday"};
        today = new Date.parse('next monday')
        expect(parse.updateTemplateWithRepeat(template).due_date.toString()).to.equal(today.toString());
    });
  });
});
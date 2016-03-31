var assert = require('assert');
var expect = require('chai').expect;

var parse = require('./../utils/parseTaskTemplate.js')
var api = require('./../utils/api.js')

describe('parseTaskTemplate.js', function () {
  describe('parseDateString())', function () {
    it('should return 1 second ago when passed \'today\'', function () {
    	var correct = Date.today().setTimeToNow().addSeconds(-1);
    	expect(parse.parseDateString('today').toString()).to.equal(correct.toString());
    });

    it('should handle the MM/DD/YYYY format', function () {
    	var correct = Date.parse("11/22/2033");
    	expect(parse.parseDateString('11/22/2033').toString()).to.equal(correct.toString())
    });
  });
  
  describe('parseContentString()', function () {

  });
  describe('updateTemplateWithRepeat()', function () {

  });
});

describe('api.js', function () {
  //TODO
});
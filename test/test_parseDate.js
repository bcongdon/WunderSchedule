var assert = require('assert');
var expect = require('chai').expect;

var parseDate = require('./../utils/parseDate.js');

describe('parseDate.js', function () {

  describe('parseDateString()', function () {
        // it('should return 1 second ago when passed \'today\'', function () {
        //  var correct = Date.today().setTimeToNow().addSeconds(-1);
        //  expect(parse.parseDateString('today').toString()).to.equal(correct.toString());
        // });

    it('should handle the MM/DD/YYYY format', function () {
      var correct = Date.parse('11/22/2033');
      expect(parseDate.parseDateString('11/22/2033').toString()).to.equal(correct.toString());
    });
  });
});
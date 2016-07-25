var assert = require('assert');
var expect = require('chai').expect;

var api = require('./../utils/api.js');

describe('api.js', function () {
  describe('defaults', function() {
    it('should have correct defaults', function(done){
      api({url: '/'}, function(err, body, res){
        expect(body.request.method).to.equal('get');
        expect(body.request.uri.href).to.equal('https://a.wunderlist.com/api/v1/');
        done();
      });
    });
  });
});
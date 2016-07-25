/*
    API

    Handles requests to the Wunderlist api.
    Wraps 'request' with default settings to access Wunderlist.
*/


var request = require('request');
var log = require('./logging.js').log;


var Configstore = require('configstore');
var pkg = require('../package.json');
var config = new Configstore(pkg.name);

if(!(config.get('client_id') && config.get('access_token'))){
  log.error('Could not load credentials. Please run `wunderschedule auth` to input your login.');
}

var defaults = {
  method: 'get',
  json: true,
  baseUrl: 'https://a.wunderlist.com/api/v1',
  headers: {
    'X-Access-Token': config.get('access_token'),
    'X-Client-ID': config.get('client_id')
  }
};

module.exports = request.defaults(defaults);

module.exports.isAuthenticated = function() {
  return config.get('authentication_time');
};


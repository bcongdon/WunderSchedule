var request = require('request')
var credentials = require('./credentials.json')

var clientID = credentials.client_id;
var accessToken = credentials.access_token;

if(!clientID || !accessToken){
	console.log("Couldn't load credentials!")
	process.exit(1);
}

module.exports = request.defaults({
  method: 'get',
  json: true,
  baseUrl: 'https://a.wunderlist.com/api/v1',
  headers: {
    'X-Access-Token': accessToken,
    'X-Client-ID': clientID,
  }
})


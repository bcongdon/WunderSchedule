/*
    API

    Handles requests to the Wunderlist api.
    Wraps 'request' with default settings to access Wunderlist.
*/


var request = require('request')

const Configstore = require('configstore');
const pkg = require('../package.json');
const config = new Configstore(pkg.name);

if(!(config.get("client_id") && config.get("access_token"))){
    console.log("ERROR: Could not load credentials. Please run `wunderschedule auth` to input your login.")
}

module.exports = request.defaults({
    method: 'get',
    json: true,
    baseUrl: 'https://a.wunderlist.com/api/v1',
    headers: {
        'X-Access-Token': config.get("access_token"),
        'X-Client-ID': config.get("client_id")
    }
})

module.exports.isAuthenticated = function() {
    return config.get("authentication_date")
}


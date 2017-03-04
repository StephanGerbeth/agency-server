"use strict";

var options = require('minimist')(process.argv.slice(2));
var serverConfig = require(process.cwd() + options.serverConfig);
var ip = require('./services/ip');

module.exports = function(config) {
    if(options.ip) {
        if(options.ip === 'true') {
            config.hapi.host = ip();
        } else {
            config.hapi.host = options.ip;
        }
    }
    init(config);
}(serverConfig);

function init(config) {
    var server = require(__dirname + '/servers/hapi')(config.root, config.hapi);
    config.servers.forEach(function(item) {
        item.module(server, item.config);
        // require(__dirname + '/servers/websocket')(server, config.websocket, config.servers.hapi.config.secret);
    });            
}

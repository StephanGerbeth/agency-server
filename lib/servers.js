"use strict";

var options = require('minimist')(process.argv.slice(2));
var serverConfig = require(process.cwd() + options.serverConfig);
var ip = require('./services/ip');

module.exports = function(config) {
    if(options.ip) {
        if(options.ip === 'true') {
            config.servers.hapi.config.host = ip();
        } else {
            config.servers.hapi.config.host = options.ip;
        }
    }
    init(config);
}(serverConfig);

function init(config) {
    if(config.servers.hapi && config.servers.hapi[process.env.NODE_ENV]) {        
        var server = require(__dirname + '/servers/hapi')(config.root, config.servers.hapi.config);

        if(config.servers.websocket && config.servers.websocket[process.env.NODE_ENV]) {
            require(__dirname + '/servers/websocket')(server, config.websocket, config.servers.hapi.config.secret);
        }
    }
}

"use strict";

var template = require('lodash/template');
var options = require('minimist')(process.argv.slice(2));
var upath = require('upath');
var serverConfig = JSON.parse(template(JSON.stringify(require(upath.join(process.cwd(), options.serverConfig))))({'root': upath.join(process.cwd())}))[(options.env || 'development')];
var ip = require('./services/ip');

module.exports = function(config) {
    if(options.ip) {
        if(options.ip === 'true') {
            config.host = ip();
        } else {
            config.host = options.ip;
        }
    }
    init(config);
}(serverConfig);

function init(config) {
    if(config.hapi) {
        var server = require(__dirname + '/servers/hapi')(config.root, config.hapi);

        if(config.websocket) {
            require(__dirname + '/servers/websocket')(server, config.websocket, config.hapi.options.secret);
        }
    }
}

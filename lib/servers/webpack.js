"use strict";

var hapi = require('hapi');
var webpackConnection = require('hapi-webpack-connection');
var path = require('path');

module.exports = function(dest, serverName, hapiConfig, webpackConfig) {
    dest = dest || 'tmp';
    serverName = serverName || 'localhost';

    var options = Object.assign({
        entry: webpackConfig.entry,        
        output: {
            path: path.dirname(dest + '/' + webpackConfig.files.dest),
            filename: path.basename(dest + '/' + webpackConfig.files.dest),
            publicPath: path.dirname(dest + '/' + webpackConfig.files.dest),
            library: webpackConfig.files.library
        }
    }, require(process.cwd() + '/env/config/webpack')({
        host: serverName,
        port: webpackConfig.port,
        path: dest
    }));

    var server = new hapi.Server();
    server.connection(webpackConnection(options).connection);
    server.start(function () {
        console.log('Debug Server running at:', server.info.uri);
    });
};

"use strict";

var template = require('lodash/template');
var upath = require('upath');
var options = require('minimist')(process.argv.slice(2));
var serverConfig = JSON.parse(template(JSON.stringify(require(upath.join(process.cwd(), options.serverConfig))))({'root': upath.join(process.cwd())}))[process.env.NODE_ENV];

module.exports = function () {
    if(serverConfig.dev) {
        require('gulp-nodemon')({
            script: require.resolve(options.server + '/lib/servers'),
            ignore: ['**/*'],
            args: ['--serverConfig=' + options.serverConfig, (options.ip) ? '--ip=' + options.ip : '']
        });

        process.once('SIGINT', function() { process.exit(0); });
    } else {
        require(options.server + '/lib/servers');
    }

    if(options.timeout) {
        setTimeout(function(){
            process.exit(0);
        },+options.timeout);
    }
};

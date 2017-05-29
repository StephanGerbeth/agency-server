"use strict";

var options = require('minimist')(process.argv.slice(2));
var serverConfig = require(process.cwd() + options.serverConfig);

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

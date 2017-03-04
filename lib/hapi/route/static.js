"use strict";

var Inert = require('inert');
var extend = require('lodash/extend');

exports.register = function(server, options, next) {    
    server.register(Inert, function() {});
    server.route({
        method: "GET",
        path: "/{param*}",
        config: extend({
                auth: false // false or 'jwt'
            },
            options.config || {}),
        handler: {
            directory: {
                path: options.root
                    // listing: true
            }
        }
    });
    next();
};

exports.register.attributes = {
    name: 'static',
    version: '1.0.0'
};

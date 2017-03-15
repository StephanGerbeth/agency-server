"use strict";

var lazy = require('lazy-cache')(require);
lazy('mixin-object', 'mixin');

module.exports = {
    createDefaultRoutes: function(server, root, options) {

        // optional security gate - auth must be configured inside route plugins
        server.register([require('hapi-auth-jwt2'), require('h2o2')], function (err) {
            if(err){
                console.log(err);
            }

            server.auth.strategy('jwt', 'jwt', true, {
                key: options.options.secret, // Never Share your secret key
                validateFunc: validate       // validate function defined above
            });

            server.register(options.routes.map(function(config) {
                return {
                    register: require(config.module),
                    options: lazy.mixin({root: root}, config.options)
                };
            }), function (err) {
                if(err){
                    console.log(err);
                }
            });
        });
    }
};

function validate(decoded, request, callback) {
    if (!decoded.auth_id) {
        return callback(null, false);
    }
    else {
        return callback(null, true);
    }
}

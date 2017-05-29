"use strict";

module.exports = {
    createDefaultRoutes: function(server, root, options) {

        // optional security gate - auth must be configured inside route plugins
        server.register([require('hapi-auth-jwt2'), require('h2o2')], function (err) {
            if(err){
                console.log(err);
            }
            server.auth.strategy('jwt', 'jwt', true, {
                key: options.secret, // Never Share your secret key
                validateFunc: validate       // validate function defined above
            });
            server.register(options.routes.reduce(function(result, item) {
                if(item[process.env.NODE_ENV]) {
                    result.push({
                        register: item.config.module,
                        options: Object.assign({root: root}, item.config.options)
                    });
                }
                return result;
            }, []), function (err) {
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

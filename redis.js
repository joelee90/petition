const redis = require('redis');
const client = redis.createClient({
    host: 'localhost',
    port: 6379
});
const {promisify} = require('util');

client.on('error', function(err) {
    console.log(err);
});

const get = exports.get = promisify(
    client.get.bind(client)
);
//permanently bind to the client.

const set = exports.get = promisify(
    client.set.bind(client)
);

const setex = exports.get = promisify(
    client.setex.bind(client)
);

const del = exports.get = promisify(
    client.del.bind(client)
);

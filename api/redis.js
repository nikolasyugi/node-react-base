const redis = require('redis');
const keys = require('./keys')();

module.exports = function () {

    if (keys.redisUrl) clientRedis = redis.createClient(keys.redisUrl)
    else clientRedis = redis.createClient()

    clientRedis.on('connect', function () {
        console.log('Connected to Redis')
    })

    clientRedis.on('error', function (err) {
        console.log('Redis error: ' + err)
    })

    //clientRedis.set('foo', 'bar'); -> sets key foo to bar
    //clientRedis.get('foo' ); -> returns bar

    return clientRedis
}
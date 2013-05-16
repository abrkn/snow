var _ = require('underscore')
, util = require('util')
, assert = require('assert')

var build = {
    insert: function(table, kv, returning) {
        var argNums = _.map(_.range(1, _.keys(kv).length + 1), function(x) {
            return '$' + x
        }).join(', ')
        , q = {
            text: util.format(
                'INSERT INTO %s (%s) VALUES (%s)%s',
                table,
                _.keys(kv).join(', '),
                argNums,
                returning ? ' RETURNING ' + returning : ''
            ),
            values: _.values(kv)
        }

        return q
    }
}

var self = module.exports = function(url, native) {
    assert(url)
    var pg = require('pg')
    if (native) pg = pg.native
    var client = new pg.Client(url)
    client.build = build
    client.connect()
    return client
}

self.build = build
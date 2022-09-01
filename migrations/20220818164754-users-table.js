'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate
    type = dbm.dataType
    seed = seedLink
}

exports.up = function (db) {
    return db.createTable('users', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        username: { type: 'string', length: 50, notNull: true, unique: true },
        first_name: { type: 'string', length: 50, notNull: true },
        last_name: { type: 'string', length: 50, notNull: true },
        email: { type: 'string', length: 255, notNull: true },
        hash: { type: 'string', length: 255, notNull: true },
    })
}

exports.down = function (db) {
    return db.dropTable('users')
}

exports._meta = {
    version: 1,
}

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
    return db.createTable('comments', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        user_id: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'fk_comments_user_id',
                table: 'users',
                mapping: 'id',
                rules: { onDelete: 'RESTRICT' },
            },
        },
        pic_id: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'fk_comments_pic_id',
                table: 'pictures',
                mapping: 'id',
                rules: { onDelete: 'RESTRICT' },
            },
        },
        timestamp: {
            type: 'timestamp',
            notNull: true,
            defaultValue: new String('CURRENT_TIMESTAMP'),
        },
        text: { type: 'string', length: 2000, notNull: true },
    })
}

exports.down = function (db) {
    return db.dropTable('comments')
}

exports._meta = {
    version: 1,
}

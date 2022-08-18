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
    return db.createTable('pictures', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        gallery_id: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'fk_pictures_gallery_id',
                table: 'galleries',
                mapping: 'id',
                rules: { onDelete: 'RESTRICT' },
            },
        },
        filename: { type: 'string', length: 255, notNull: true },
    })
}

exports.down = function (db) {
    return db.dropTable('pictures')
}

exports._meta = {
    version: 1,
}

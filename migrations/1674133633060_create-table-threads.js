/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('threads',{
        id: {
            type: 'VARCHAR(100)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        body: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'TEXT',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
        },
        deleted_at: {
            type: 'TIMESTAMP',
            notNull: false,
            default: null
        },

    })
};

exports.down = pgm => {
    pgm.dropTable('threads')
};

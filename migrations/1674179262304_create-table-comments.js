/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('comments',{
        id: {
            type: 'VARCHAR(100)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'TEXT',
            notNull: true,
        },
        thread_id:{
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
    pgm.addConstraint('comments', 'fk_comments.threads.thread_id','FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE')
    pgm.addConstraint('comments', 'fk_comments.users.owner','FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
};

exports.down = pgm => {
    pgm.dropConstraint('comments','fk_comments.threads.thread_id')
    pgm.dropConstraint('comments','fk_comments.users.owner')
    pgm.dropTable('comments')
};

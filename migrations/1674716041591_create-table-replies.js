/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('replies',
        {
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
            comment_id:{
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
    pgm.addConstraint('replies', 'fk_replies.comments.comment_id','FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE')
    pgm.addConstraint('replies', 'fk_replies.users.owner','FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')

};

exports.down = pgm => {
    pgm.dropConstraint('replies','fk_replies.comments.comment_id')
    pgm.dropConstraint('replies','fk_replies.users.owner')
    pgm.dropTable('replies')
};

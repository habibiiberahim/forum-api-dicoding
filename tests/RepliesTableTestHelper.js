/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1');
    },

    async addReply(
        {
            id='reply-001',
            content = 'reply',
            commentId = 'comment-123',
            owner='user-123',
            created_at='2023-01-23 12:00:33.809000'}){
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5)',
            values: [id, content, owner, commentId, created_at],
        };

        await pool.query(query);
    },
    async findReply(id){
        const query = {
            text: 'select deleted_at from replies where id=$1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows[0]
    }

};

module.exports = RepliesTableTestHelper

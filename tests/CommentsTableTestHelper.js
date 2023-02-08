/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },

    async addComment(
        {
            id='comment-123',
            content='komentar',
            owner='user-123',
            thread_id = 'thread-123',
            created_at = '2023-01-23 12:00:33.809000'
        }){
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
            values: [id, content, owner, thread_id, created_at],
        };

        await pool.query(query);
    },
    async findComment(id){
        const query = {
            text: 'select deleted_at from comments where id=$1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows[0]
    },
    async findCommentByThreadId(threadId){
        const query = {
            text: ` SELECT comments.id, username, created_at, content, deleted_at FROM comments
                    INNER JOIN users u on comments.owner = u.id WHERE thread_id = $1 ORDER BY created_at ASC`,
            values: [threadId],
        };
        const result = await pool.query(query);
        return result.rows
    }
};

module.exports = CommentsTableTestHelper

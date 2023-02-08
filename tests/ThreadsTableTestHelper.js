/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    },

    async addThread(
        {
            id='thread-123',
            title='title',
            body='body',
            owner='user-123',
            created_at='2023-01-23 12:00:33.809000'}){
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
            values: [id, title, body, owner, created_at],
        };

        await pool.query(query);
    }
};

module.exports = ThreadsTableTestHelper

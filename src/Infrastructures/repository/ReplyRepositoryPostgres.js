const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply')
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ReplyRepositoryPostgres extends ReplyRepository{
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator
    }

    async addReply(newReply) {
        const { content, commentId, owner } = newReply;
        const id = `reply-${this._idGenerator()}`;
        const created_at = new Date().toISOString();

        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5 ) RETURNING id, content, owner',
            values: [id, content, owner, commentId, created_at],
        };
        const result = await this._pool.query(query);
        return new AddedReply({...result.rows[0]})
    }

    async verifyReplyOwner(replyId, owner) {
        const query = {
            text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
            values: [replyId, owner],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new AuthorizationError('anda tidak berhak mengakses balasan ini');
        }
    }

    async verifyReplyIsExist(replyId){
        const query = {
            text: 'SELECT id FROM replies WHERE id = $1',
            values: [replyId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
    }

    async deleteReply(replyId) {
        const deleted_at = new Date().toISOString();
        const query = {
            text: 'UPDATE replies SET deleted_at = $1 where id = $2',
            values: [ deleted_at, replyId],
        };
        await this._pool.query(query);
    }

    async getRepliesByThreadId(threadId) {
        const query = {
            text: `SELECT replies.id, replies.content, replies.comment_id, replies.created_at, replies.deleted_at,u.username
                    FROM replies INNER JOIN comments c on c.id = replies.comment_id
                    INNER JOIN users u on u.id = replies.owner
                    WHERE c.thread_id = $1
                    ORDER BY created_at ASC`,
            values: [threadId],
        };
        const result = await this._pool.query(query);
        return result.rows
    }
}

module.exports = ReplyRepositoryPostgres
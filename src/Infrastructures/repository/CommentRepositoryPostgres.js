const CommentRepository = require('../../Domains/comments/CommentRepository')
const AddedComment = require('../../Domains/comments/entities/AddedComment')
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(newComment) {
        const { content, thread_id, owner } = newComment;
        const id = `comment-${this._idGenerator()}`;
        const created_at = new Date().toISOString();

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5 ) RETURNING id, content, owner',
            values: [id, content, owner, thread_id, created_at],
        };
        const result = await this._pool.query(query);
        return new AddedComment({ ...result.rows[0] });
    }

    async verifyCommentOwner(commentId, owner){
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
            values: [commentId, owner],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new AuthorizationError('anda tidak berhak mengakses komentar ini');
        }
    }

    async verifyCommentIsExist(commentId) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1',
            values: [commentId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('komentar tidak ditemukan');
        }
    }

    async deleteComment(commentId){
        const deleted_at = new Date().toISOString();
        const query = {
            text: 'UPDATE comments SET deleted_at = $1 where id = $2',
            values: [ deleted_at, commentId],
        };
        await this._pool.query(query);
    }
    async getCommentByThreadId(threadId) {
        const query = {
            text: ` SELECT comments.id, username, created_at, content, deleted_at FROM comments
                    INNER JOIN users u on comments.owner = u.id WHERE thread_id = $1 ORDER BY created_at ASC`,
            values: [threadId],
        };
        const result = await this._pool.query(query);
        return result.rows
    }
}

module.exports = CommentRepositoryPostgres
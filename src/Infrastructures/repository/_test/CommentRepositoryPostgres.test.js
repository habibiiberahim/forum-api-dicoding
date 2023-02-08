const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', function () {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end();
    })

    describe('addComment function', function () {
        it('should return addedComment correctly', async function () {
           //Arrange
            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})

            const newComment = {
                content:'komentar',
                owner:'user-123',
                thread_id:'thread-123'
            }
            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            //Action
            const addedComment = await commentRepositoryPostgres.addComment(newComment)

            //Assert
            expect(addedComment).toEqual({
                id:'comment-123',
                content:'komentar',
                owner:'user-123'
            })
        });

        it('should persist add comment', async function () {
            //Arrange
            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})

            const newComment = {
                content:'komentar',
                owner:'user-123',
                thread_id:'thread-123'
            }
            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            //Action
            await commentRepositoryPostgres.addComment(newComment)

            const comment = await CommentsTableTestHelper.findCommentByThreadId(newComment.thread_id)
            expect(comment).toHaveLength(1)
        });
    });

    describe('verifyCommentIsExist function', function () {
        it('should throw NotFoundError when comment not exist', async function () {
            //Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            //Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentIsExist('')).rejects.toThrowError(NotFoundError)
        });
        it('should not throw NotFoundError when comment not exist', async function () {
            //Arrange
            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            //Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentIsExist('comment-123')).resolves.not.toThrowError(NotFoundError)
        });
    });

    describe('verifyCommentOwner function', function () {
        it('should throw AuthorizationError when user not have access token valid', async function () {
            //Arrange
            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            //Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456')).rejects.toThrowError(AuthorizationError)
        });

        it('should not throw AuthorizationError when user not have access token valid', async function () {
            //Arrange
            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            //Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError)

        });
    });

    describe('deleteComment function', function () {
        it('should persist delete comment correctly', async function () {
            //Arrange
            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            //Action
            await commentRepositoryPostgres.deleteComment('comment-123')

            //Assert
            const {deleted_at} = await CommentsTableTestHelper.findComment('comment-123')
            expect(deleted_at).not.toBeNull()
        });

        it('should return null when find comment is exist', async function () {
            //Arrange
            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            //Action and Assert
            const {deleted_at} = await CommentsTableTestHelper.findComment('comment-123')
            expect(deleted_at).toBeNull()
        });
    });

    describe('getCommentByThreadId function',  function () {
        it('should return all comments from database', async function () {
            //Arrange
            const threadId = 'thread-123'
            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({id:threadId})
            await CommentsTableTestHelper.addComment({
                id:'comment-1'
            })

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            //Action
            const comments = await commentRepositoryPostgres.getCommentByThreadId(threadId)

            //Assert
            expect(comments[0].id).toEqual('comment-1')
            expect(comments[0].username).toEqual('dicoding')
            expect(comments[0].content).toEqual('komentar')
            expect(comments).toHaveLength(1)
        });
    });
});
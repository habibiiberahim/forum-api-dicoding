const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe('ReplyRepositoryPostgres', function () {
    afterEach(async function () {
        await ThreadsTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await RepliesTableTestHelper.cleanTable()
    });

    afterAll(async function () {
        await pool.end();
    });

    describe('addReply function', function () {
        it('should persist new reply and return added reply correctly', async function () {
            //Arrange
            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            const newReply = {
                content:'reply 1',
                commentId:'comment-123',
                owner:'user-123'
            }
            const fakeIdGenerator = () => '001'; // stub!
            const replyRepositoryPostgres= new ReplyRepositoryPostgres(pool, fakeIdGenerator)

            //Action
            const addedReply = await replyRepositoryPostgres.addReply(newReply)

            //Assert
            expect(addedReply).toEqual({
                content:'reply 1',
                id:'reply-001',
                owner:'user-123'
            })
        });
    });

    describe('verifyReplyOwner function', function () {
        it('should throw AuthorizationError when reply is not own', async function () {
            //Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

            //Action and Assert
            await expect(replyRepositoryPostgres.verifyReplyOwner('','')).rejects.toThrowError(AuthorizationError)
        });

        it('should not throw AuthorizationError when reply is not own', async function () {
            //Arrange
            await UsersTableTestHelper.addUser({ username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({id:'thread-123'});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({})

            //Action
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

            //Assert
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-001','user-123')).resolves.not.toThrowError(AuthorizationError)
        });
    });

    describe('verifyReplyIsExist function', function () {
        it('should throw NotFoundError when reply is not available', async function () {
            //Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

            //Action and Assert
            await expect(replyRepositoryPostgres.verifyReplyIsExist('')).rejects.toThrowError(NotFoundError)
        });

        it('should not throw NotFoundError when reply is not available', async function () {
            await UsersTableTestHelper.addUser({ username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({id:'thread-123'});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({})

            //Action
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

            //Assert
            await expect(replyRepositoryPostgres.verifyReplyIsExist('reply-001')).resolves.not.toThrowError(NotFoundError)
        });
    });

    describe('deleteReply function', function () {
        it('should persist delete reply correctly', async function () {
            await UsersTableTestHelper.addUser({ username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({id:'thread-123'});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({})

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

            //Action
            await replyRepositoryPostgres.deleteReply('reply-001')

            //Assert
            const {deleted_at} = await RepliesTableTestHelper.findReply('reply-001')
            expect(deleted_at).not.toBeNull()
        });
    });

    describe('getRepliesByThreadId function', function () {
        it('should return detail replies from database', async function () {
            //Arrange
            const expectedDetailReply = {
                id:'reply-001',
                content:'reply',
                commentId: 'comment-123',
                username:'dicoding'
            }

            await UsersTableTestHelper.addUser({ username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({id:'thread-123'});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({})

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})


            //Action
            const detailReply = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

            //Assert
            expect(detailReply[0].id).toEqual(expectedDetailReply.id)
            expect(detailReply[0].content).toEqual(expectedDetailReply.content)
            expect(detailReply[0].comment_id).toEqual(expectedDetailReply.commentId)
            expect(detailReply[0].created_at).toBeDefined()
            expect(detailReply[0].deleted_at).toBeDefined()
            expect(detailReply[0].username).toEqual(expectedDetailReply.username)
        });
    });
});
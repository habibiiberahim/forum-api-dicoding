const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepositoryPostgres', function () {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end();
    })

    describe('addThread function', function () {
        it('should persist new thread and return added thread correctly', async function () {
            //Arrange
            const newThread = {
                title:'this is thread',
                body: 'this is body',
                owner:'user-123'
            }
            const fakeIdGenerator = () => '001'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            //Action
            const addedThread = await threadRepositoryPostgres.addThread(newThread)

            //Assert
            expect(addedThread).toEqual({
                id:'thread-001',
                title:'this is thread',
                owner:'user-123'
            })
        });
    });

    describe('verifyThreadIsExist function', function () {
        it('should throw NotFoundError when thread not available', async function () {
            //Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

            //Action and Assert
            await expect(threadRepositoryPostgres.verifyThreadIsExist('')).rejects.toThrowError(NotFoundError)
        });

        it('should not throw NotFoundError when thread not available', async function () {
            //Arrange
            await UsersTableTestHelper.addUser({ username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({id:'thread-123'});
            await CommentsTableTestHelper.addComment({});
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

            //Action and Assert
            await expect(threadRepositoryPostgres.verifyThreadIsExist('thread-123')).resolves.not.toThrowError(NotFoundError)
        });
    });

    describe('getDetailThread function', function () {
        it('should return detail thread from database', async function () {
            //Arrange
            const expectedDetailThread = {
                id: 'thread-123',
                title: 'title',
                body: 'body',
                created_at: new Date('2023-01-23T04:00:33.809Z'),
                username: 'dicoding'
            }
            await UsersTableTestHelper.addUser({ username: expectedDetailThread.username });
            await ThreadsTableTestHelper.addThread({
                id:expectedDetailThread.id,
                title: expectedDetailThread.title,
                body:expectedDetailThread.body,
                created_at: expectedDetailThread.created_at
            });


            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

            //Action
            const detailThread = await threadRepositoryPostgres.getDetailThread('thread-123');

            //Assert
            expect(detailThread.id).toEqual(expectedDetailThread.id)
            expect(detailThread.title).toEqual(expectedDetailThread.title)
            expect(detailThread.body).toEqual(expectedDetailThread.body)
            expect(detailThread.created_at).toEqual(expectedDetailThread.created_at)
            expect(detailThread.username).toEqual(expectedDetailThread.username)
        });
    });
});
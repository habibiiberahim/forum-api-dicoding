const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', function () {
    afterAll(async () =>{
        pool.end();
    });
    
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    describe('when POST /threads/{threadId}/comment', function () {
        it('should response 401 when not have token valid', async function () {
            //Arrange
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/{threadId}/comments',
                payload: {},
            });

            //Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401)
            expect(responseJson.error).toEqual('Unauthorized')
            expect(responseJson.message).toEqual('Missing authentication')
        });

        it('should response 404 when thread is not available', async function () {
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username:'dicoding',
                    password: 'secret'
                },
            });
            const {data} = JSON.parse(loginResponse.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/{threadId}/comments',
                payload: {},
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);
            expect(responseJson.message).toEqual('thread tidak ditemukan')
        });

        it('should response 400 when request payload not contain needed property', async function () {
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username:'dicoding',
                    password: 'secret'
                },
            });
            const {data} = JSON.parse(loginResponse.payload);

            const threadId = 'thread-123'
            await ThreadsTableTestHelper.addThread({id:threadId})

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {},
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada')
        });

        it('should response 400 when request payload not meet data type specification', async function () {
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username:'dicoding',
                    password: 'secret'
                },
            });
            const {data} = JSON.parse(loginResponse.payload);

            const threadId = 'thread-123'
            await ThreadsTableTestHelper.addThread({id:threadId})

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content:123
                },
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai')
        });

        it('should response 201 and persisted comment', async function () {
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username:'dicoding',
                    password: 'secret'
                },
            });
            const {data} = JSON.parse(loginResponse.payload);

            const threadId = 'thread-123'
            await ThreadsTableTestHelper.addThread({id:threadId})

            const requestPayload = {
                content:'konten'
            }
            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment.id).toBeDefined();
            expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
            expect(responseJson.data.addedComment.owner).toBeDefined();
        });
    });

    describe('when DELETE /threads/{threadId}/comment/{commentId}', function () {
        it('should response 401 when not have token valid', async function () {
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/{threadId}/comments/{commentId}',
            });

            //Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized')
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 404 when comment is not found', async function () {
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username:'dicoding',
                    password: 'secret'
                },
            });
            const {data} = JSON.parse(loginResponse.payload);

            await ThreadsTableTestHelper.addThread({})
            const threadId = 'thread-123'
            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/{commentId}`,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.message).toEqual('komentar tidak ditemukan')
        });

        it('should response 403 when not have access comment owner', async function () {
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'habibi',
                    password: 'rahasia',
                    fullname: 'Habibi Iberahim',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username:'habibi',
                    password: 'rahasia'
                },
            });
            const {data} = JSON.parse(loginResponse.payload);

            const threadId = 'thread-123'
            const commentId = 'comment-123'

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.message).toEqual('anda tidak berhak mengakses komentar ini')
        });

        it('should response 201 and delete comment', async function () {
            //Arrange

            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            const userResponse = await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'habibi',
                    password: 'rahasia',
                    fullname: 'Habibi Iberahim',
                },
            });

            const  userResponseJson  = JSON.parse(userResponse.payload)

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username:'habibi',
                    password: 'rahasia'
                },
            });
            const {data} = JSON.parse(loginResponse.payload);

            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({
                owner:userResponseJson.data.addedUser.id
            })

            const threadId = 'thread-123'
            const commentId = 'comment-123'

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success')
        });
    });
});
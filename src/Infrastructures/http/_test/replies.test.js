const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");


describe('/replies endpoint', function () {
    afterEach(async function () {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable()
    });
    
    afterAll(async function () {
        pool.end();
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', function () {
        it('should response 401 when not have token valid', async function () {
            //Arrange
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/{threadId}/comments/{commentId}/replies',
                payload: {},
            });

            //Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 404 when comment is not available', async function () {
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

            const threadId ='thread-123'
            await ThreadsTableTestHelper.addThread({id:threadId})
            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/{commentId}/replies`,
                payload: {},
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.message).toEqual('komentar tidak ditemukan')
        });

        it('should response 400 when request payload not contain needed property', async function () {
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
            const commentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseCommentJson = JSON.parse(commentResponse.payload);
            const commentId = responseCommentJson.data.addedComment.id

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: {},
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada')

        });

        it('should response 400 when request payload not meet data type specification', async function () {
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
            const commentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseCommentJson = JSON.parse(commentResponse.payload);
            const commentId = responseCommentJson.data.addedComment.id

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: {
                    content:123
                },
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai')
        });

        it('should response 201 and persisted reply', async function () {
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
            const commentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseCommentJson = JSON.parse(commentResponse.payload);
            const commentId = responseCommentJson.data.addedComment.id

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply.id).toBeDefined();
            expect(responseJson.data.addedReply.content).toEqual(requestPayload.content);
            expect(responseJson.data.addedReply.owner).toBeDefined();
        });
    });

    describe('when DELETE /threads/{threadId}/comment/{commentId}/replies/{replyId}', function () {
        it('should response 401 when not have token valid', async function () {
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
            });

            //Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Missing authentication');

        });

        it('should response 404 when reply is not available', async function () {
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

            const commentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseCommentJson = JSON.parse(commentResponse.payload);
            const commentId = responseCommentJson.data.addedComment.id

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/{replyId}}`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.message).toEqual('balasan tidak ditemukan')
        });

        it('should response 400 when not have access reply owner', async function () {
            const server = await createServer(container);

            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})
            await RepliesTableTestHelper.addReply({})

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
            const replyId = 'reply-001'

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.message).toEqual('anda tidak berhak mengakses balasan ini')
        });

        it('should response 201 and persisted reply', async function () {
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

            const commentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const responseCommentJson = JSON.parse(commentResponse.payload);
            const commentId = responseCommentJson.data.addedComment.id

           const replyResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });

            const responseReplyJson = JSON.parse(replyResponse.payload);
            const replyId = responseReplyJson.data.addedReply.id

            //Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success')
        });
    });
});
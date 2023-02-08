const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', function () {
    afterAll(async () => {
        pool.end()
    })

    afterEach( async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
    })

    describe('when POST /threads', function () {
        it('should response 401 when token not exist', async function () {
            //Arrange
            const requestPayload = {
                title: 'title',
                body: 'body'
            };

            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            //Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Missing authentication');
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

            const requestPayload = {
                title: 'title',
            };

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization:`Bearer ${data.accessToken} `
                }
            });

            //Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
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

            const requestPayload = {
                title: 'title',
                body: true
            };

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization:`Bearer ${data.accessToken} `
                }
            });

            //Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
        });

        it('should response 201 and persisted thread', async function () {
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

            const requestPayload = {
                title: 'title',
                body: 'body'
            };

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization:`Bearer ${data.accessToken} `
                }
            });

            //Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread.id).toBeDefined();
            expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
            expect(responseJson.data.addedThread.owner).toBeDefined();
        });
    });

    describe('when GET /threads/{threadId}', function () {
        it('should response 404 when thread is not available', async function () {
            // eslint-disable-next-line no-undef
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/xxx}`,
            });

            //Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });
        it('should response 200 and return detail thread ', async function () {
            // eslint-disable-next-line no-undef
            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            const server = await createServer(container);

            const requestParams = {
                threadId:'thread-123'
            };

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${requestParams.threadId}`,
            });

            //Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread.comments).toHaveLength(1)
        });
    });
});
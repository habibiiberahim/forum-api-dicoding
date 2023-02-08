const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const AuthenticationTokenManager = require('../../../Infrastructures/security/JwtTokenManager')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../../use_case/AddThreadUseCase')

describe('AddThreadUseCase', function () {
    it('should orchestrating the add thread action correctly', async function () {
        // Arrange
        const useCasePayload = {
            title: 'this is title',
            body: 'this is body',
        };
        const expectedAddedThread = new AddedThread({
            id:'thread-001',
            title: useCasePayload.title,
            owner:'user-001'
        });

        const useCaseAuthorization = 'Bearer accessToken'

        const mockThreadRepository = new ThreadRepository()
        const mockAuthenticationTokenManager = new AuthenticationTokenManager()

        mockAuthenticationTokenManager.verifyTokenIsExist = jest.fn()
            .mockImplementation(() => Promise.resolve('accessToken'))
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockAuthenticationTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({id:'user-001'}))

        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedAddedThread));

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
            authenticationTokenManager: mockAuthenticationTokenManager
        })

        //Action
        const addedThread = await addThreadUseCase.execute(useCasePayload, useCaseAuthorization)

        //Assert
        expect(addedThread).toEqual({
            id:'thread-001',
            title:'this is title',
            owner:'user-001'
        })
        expect(mockAuthenticationTokenManager.verifyTokenIsExist).toBeCalledWith(useCaseAuthorization)
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith('accessToken')
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith('accessToken')
        expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: 'user-001'
        }))
    });
});
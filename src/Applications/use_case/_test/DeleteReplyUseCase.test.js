const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AuthenticationTokenManager = require("../../../Infrastructures/security/JwtTokenManager");
const DeleteReplyUseCase = require('../DeleteReplyUseCase')

describe('DeleteReplyUseCase', function () {
    it('should orchestrating the delete reply action correctly', async function () {
        //Arrange
        const useCaseParams = {
            replyId : 'reply-001'
        }

        const useCaseAuthorization = 'Bearer accessToken'

        const mockReplyRepository = new ReplyRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockAuthenticationTokenManager.verifyTokenIsExist = jest.fn()
            .mockImplementation(() => Promise.resolve('accessToken'))
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockAuthenticationTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({id:'user-123'}))

        mockReplyRepository.verifyReplyIsExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyReplyOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository:mockReplyRepository,
            authenticationTokenManager: mockAuthenticationTokenManager
        })

        //Action
        await deleteReplyUseCase.execute(useCaseParams, useCaseAuthorization)

        //Assert
        expect(mockAuthenticationTokenManager.verifyTokenIsExist).toBeCalledWith(useCaseAuthorization)
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith('accessToken')
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith('accessToken')
        expect(mockReplyRepository.verifyReplyIsExist).toBeCalledWith(useCaseParams.replyId)
        expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCaseParams.replyId, 'user-123')
        expect(mockReplyRepository.deleteReply).toBeCalledWith(useCaseParams.replyId)
    });
});
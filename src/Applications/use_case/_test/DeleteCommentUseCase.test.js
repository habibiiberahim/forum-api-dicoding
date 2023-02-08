const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AuthenticationTokenManager = require("../../../Infrastructures/security/JwtTokenManager");
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', function () {
    it('should orchestrating the delete comment action correctly', async function () {
        //Arrange
        const useCaseParams = {
            threadId: 'thread-123',
            commentId: 'comment-123'
        }

        const useCaseAuthorization = 'Bearer accessToken'

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockAuthenticationTokenManager.verifyTokenIsExist = jest.fn()
            .mockImplementation(() => Promise.resolve('accessToken'))
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockAuthenticationTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({id:'user-123'}))

        mockThreadRepository.verifyThreadIsExist = jest.fn()
            .mockImplementation(() => Promise.resolve());

        mockCommentRepository.verifyCommentIsExist = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository:mockThreadRepository,
            commentRepository:mockCommentRepository,
            authenticationTokenManager:mockAuthenticationTokenManager
        })

        //Action
        await deleteCommentUseCase.execute(useCaseParams, useCaseAuthorization)

        //Assert
        expect(mockAuthenticationTokenManager.verifyTokenIsExist).toBeCalledWith(useCaseAuthorization)
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith('accessToken')
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith('accessToken')
        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCaseParams.threadId)
        expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(useCaseParams.commentId)
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCaseParams.commentId, 'user-123')
        expect(mockCommentRepository.deleteComment).not.toThrowError()
    });
});
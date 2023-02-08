const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AuthenticationTokenManager = require("../../../Infrastructures/security/JwtTokenManager");

const AddReplyUseCase =  require('../AddReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');

describe('AddReplyUseCase', function () {
    it('should should orchestrating the add reply action correctly', async function () {
        //Arrange
        const useCasePayload = {
            content:'reply',

        }

        const useCaseParams = {
            threadId: 'thread-123',
            commentId:'comment-123'
        }

        const useCaseAuthorization = 'Bearer accessToken'

        const expectedAddedReply = new AddedReply({
            id:'reply-001',
            content: 'reply',
            owner:'user-123',
        })
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository =  new ReplyRepository()
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
            .mockImplementation(() => Promise.resolve());

        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve(new AddedReply({
                id:'reply-001',
                content: 'reply',
                owner:'user-123',
            })));


        const addReplyUseCase = new AddReplyUseCase({
            replyRepository:mockReplyRepository,
            commentRepository:mockCommentRepository,
            threadRepository:mockThreadRepository,
            authenticationTokenManager:mockAuthenticationTokenManager
        })

        //Action
        const addedReply = await addReplyUseCase.execute(useCasePayload, useCaseParams, useCaseAuthorization)

        //Assert
        expect(addedReply).toEqual({
            id:'reply-001',
            content:'reply',
            owner:'user-123'
        })
        expect(mockAuthenticationTokenManager.verifyTokenIsExist).toBeCalledWith(useCaseAuthorization)
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith('accessToken')
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith('accessToken')
        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCaseParams.threadId)
        expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(useCaseParams.commentId)
        expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
            content: useCasePayload.content,
            owner:'user-123',
            commentId:useCaseParams.commentId
        }))

    });
});
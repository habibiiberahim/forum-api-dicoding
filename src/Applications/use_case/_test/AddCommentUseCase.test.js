const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const AddCommentUseCase = require('../AddCommentUseCase')


describe('AddCommentUseCase', function () {
    it('should should orchestrating the add comment action correctly', async function () {
        //Arrange
        const useCasePayload = {
           content:'konten'
        }

        const useCaseParams = {
            threadId: 'thread-123'
        }

        const id = 'user-123'

        const expectedAddedComment = new AddedComment({
            id:'comment-123',
            content: 'konten',
            owner:'user-123',
            thread_id: 'thread-123'
        })

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()


        mockThreadRepository.verifyThreadIsExist = jest.fn()
            .mockImplementation(() => Promise.resolve());

        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(new AddedComment({
                id:'comment-123',
                content: 'konten',
                owner:'user-123',
                thread_id: 'thread-123'
            })));

        const addCommentUseCase = new AddCommentUseCase({
            threadRepository:mockThreadRepository,
            commentRepository:mockCommentRepository,
        })
        //Action
        const addedComment = await addCommentUseCase.execute(useCasePayload, useCaseParams, id)

        //Assert
        expect(addedComment).toEqual({
            id:'comment-123',
            content:'konten',
            owner:'user-123'
        })

        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCaseParams.threadId)
        expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
            content: useCasePayload.content,
            owner:'user-123',
            thread_id:useCaseParams.threadId
        }))
    });
});
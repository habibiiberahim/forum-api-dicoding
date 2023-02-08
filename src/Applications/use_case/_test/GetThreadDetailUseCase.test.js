const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase')

describe('GetThreadDetailUseCase', function () {
    it('should orchestrating the thread detail action correctly', async function () {
        //Arrange
        const useCaseParams = {
            threadId: 'thread-123',
        }
        const thread = {
            id:'thread-123',
            title:'title',
            body:'body',
            created_at:new Date(),
            username:'habibi',
            comments:[]
        }

        const comments = [{
            id:'comment-001',
            username:'habibi',
            created_at:new Date(),
            content:'comment',
            deleted_at : null,
            replies:[]
        }]

        const replies = [
            {
                id:'reply-1',
                username:'habibi',
                comment_id:'comment-001',
                created_at:new Date(),
                deleted_at : null,
                content:'reply 1',
            },
            {
                id:'reply-2',
                username:'habibi',
                comment_id:'comment-001',
                created_at:new Date(),
                deleted_at : null,
                content:'reply 2',
            }
        ]

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository =  new ReplyRepository()

        mockThreadRepository.verifyThreadIsExist = jest.fn()
            .mockImplementation( () => Promise.resolve());

        //return detail thread
        mockThreadRepository.getDetailThread = jest.fn()
            .mockImplementation( () => Promise.resolve(thread));

        //return all comments
        mockCommentRepository.getCommentByThreadId = jest.fn()
            .mockImplementation( () => Promise.resolve(comments));

        //return all replies
        mockReplyRepository.getRepliesByThreadId = jest.fn()
            .mockImplementation( () => Promise.resolve(replies));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository:mockThreadRepository,
            commentRepository:mockCommentRepository,
            replyRepository: mockReplyRepository
        })

        //Action
        const detailThread = await getThreadDetailUseCase.execute(useCaseParams)

        //Assert
        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCaseParams.threadId)
        expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCaseParams.threadId)
        expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId)
        expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParams.threadId)
        expect(detailThread.id).toEqual(thread.id)
        expect(detailThread.title).toEqual(thread.title)
        expect(detailThread.body).toEqual(thread.body)
        expect(detailThread.date).toEqual(thread.created_at)
        expect(detailThread.username).toEqual(thread.username)

        expect(detailThread.comments[0].id).toEqual(comments[0].id)
        expect(detailThread.comments[0].username).toEqual(comments[0].username)
        expect(detailThread.comments[0].content).toEqual(comments[0].content)
        expect(detailThread.comments[0].date).toEqual(comments[0].created_at)

        expect(detailThread.comments[0].replies[0].id).toEqual(replies[0].id)
        expect(detailThread.comments[0].replies[0].username).toEqual(replies[0].username)
        expect(detailThread.comments[0].replies[0].date).toEqual(replies[0].created_at)
        expect(detailThread.comments[0].replies[0].content).toEqual(replies[0].content)

        expect(detailThread.comments[0].replies[1].id).toEqual(replies[1].id)
        expect(detailThread.comments[0].replies[1].username).toEqual(replies[1].username)
        expect(detailThread.comments[0].replies[1].date).toEqual(replies[1].created_at)
        expect(detailThread.comments[0].replies[1].content).toEqual(replies[1].content)
    });

    it('should orchestrating the thread detail action correctly when comment is deleted', async function () {
        //Arrange
        const useCaseParams = {
            threadId: 'thread-123',
        }
        const thread = {
            id:'thread-123',
            title:'title',
            body:'body',
            created_at:new Date(),
            username:'habibi',
            comments:[]
        }

        const comments = [{
            id:'comment-001',
            username:'habibi',
            created_at:new Date(),
            content:'comment',
            deleted_at : new Date(),
            replies:[]
        }]

        const replies = [
            {
                id:'reply-1',
                username:'habibi',
                comment_id:'comment-001',
                created_at:new Date(),
                deleted_at : null,
                content:'reply 1',
            },
            {
                id:'reply-2',
                username:'habibi',
                comment_id:'comment-001',
                created_at:new Date(),
                deleted_at : null,
                content:'reply 2',
            }
        ]

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository =  new ReplyRepository()

        mockThreadRepository.verifyThreadIsExist = jest.fn()
            .mockImplementation( () => Promise.resolve());
        mockThreadRepository.getDetailThread = jest.fn()
            .mockImplementation( () => Promise.resolve(thread));

        mockCommentRepository.getCommentByThreadId = jest.fn()
            .mockImplementation( () => Promise.resolve(comments));

        mockReplyRepository.getRepliesByThreadId = jest.fn()
            .mockImplementation( () => Promise.resolve(replies));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository:mockThreadRepository,
            commentRepository:mockCommentRepository,
            replyRepository: mockReplyRepository
        })

        //Action
        const detailThread = await getThreadDetailUseCase.execute(useCaseParams)

        //Assert
        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCaseParams.threadId)
        expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCaseParams.threadId)
        expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId)
        expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParams.threadId)
        expect(detailThread.id).toEqual(thread.id)
        expect(detailThread.title).toEqual(thread.title)
        expect(detailThread.body).toEqual(thread.body)
        expect(detailThread.date).toEqual(thread.created_at)
        expect(detailThread.username).toEqual(thread.username)

        expect(detailThread.comments[0].id).toEqual(comments[0].id)
        expect(detailThread.comments[0].username).toEqual(comments[0].username)
        expect(detailThread.comments[0].content).toEqual('**komentar telah dihapus**')
        expect(detailThread.comments[0].date).toEqual(comments[0].created_at)

        expect(detailThread.comments[0].replies[0].id).toEqual(replies[0].id)
        expect(detailThread.comments[0].replies[0].username).toEqual(replies[0].username)
        expect(detailThread.comments[0].replies[0].date).toEqual(replies[0].created_at)
        expect(detailThread.comments[0].replies[0].content).toEqual(replies[0].content)

        expect(detailThread.comments[0].replies[1].id).toEqual(replies[1].id)
        expect(detailThread.comments[0].replies[1].username).toEqual(replies[1].username)
        expect(detailThread.comments[0].replies[1].date).toEqual(replies[1].created_at)
        expect(detailThread.comments[0].replies[1].content).toEqual(replies[1].content)

    });

    it('should orchestrating the thread detail action correctly when replies is deleted', async function () {
        //Arrange
        const useCaseParams = {
            threadId: 'thread-123',
        }
        const thread = {
            id:'thread-123',
            title:'title',
            body:'body',
            created_at:new Date(),
            username:'habibi',
            comments:[]
        }

        const comments = [{
            id:'comment-001',
            username:'habibi',
            created_at:new Date(),
            content:'comment',
            deleted_at : null,
            replies:[]
        }]

        const replies = [
            {
                id:'reply-1',
                username:'habibi',
                comment_id:'comment-001',
                created_at:new Date(),
                deleted_at : null,
                content:'reply 1',
            },
            {
                id:'reply-2',
                username:'habibi',
                comment_id:'comment-001',
                created_at:new Date(),
                deleted_at : new Date(),
                content:'reply 2',
            }
        ]

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository =  new ReplyRepository()

        mockThreadRepository.verifyThreadIsExist = jest.fn()
            .mockImplementation( () => Promise.resolve());
        mockThreadRepository.getDetailThread = jest.fn()
            .mockImplementation( () => Promise.resolve(thread));

        mockCommentRepository.getCommentByThreadId = jest.fn()
            .mockImplementation( () => Promise.resolve(comments));

        mockReplyRepository.getRepliesByThreadId = jest.fn()
            .mockImplementation( () => Promise.resolve(replies));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository:mockThreadRepository,
            commentRepository:mockCommentRepository,
            replyRepository: mockReplyRepository
        })

        //Action
        const detailThread = await getThreadDetailUseCase.execute(useCaseParams)

        //Assert
        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCaseParams.threadId)
        expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCaseParams.threadId)
        expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId)
        expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParams.threadId)
        expect(detailThread.id).toEqual(thread.id)
        expect(detailThread.title).toEqual(thread.title)
        expect(detailThread.body).toEqual(thread.body)
        expect(detailThread.date).toEqual(thread.created_at)
        expect(detailThread.username).toEqual(thread.username)

        expect(detailThread.comments[0].id).toEqual(comments[0].id)
        expect(detailThread.comments[0].username).toEqual(comments[0].username)
        expect(detailThread.comments[0].content).toEqual(comments[0].content)
        expect(detailThread.comments[0].date).toEqual(comments[0].created_at)

        expect(detailThread.comments[0].replies[0].id).toEqual(replies[0].id)
        expect(detailThread.comments[0].replies[0].username).toEqual(replies[0].username)
        expect(detailThread.comments[0].replies[0].date).toEqual(replies[0].created_at)
        expect(detailThread.comments[0].replies[0].content).toEqual(replies[0].content)

        expect(detailThread.comments[0].replies[1].id).toEqual(replies[1].id)
        expect(detailThread.comments[0].replies[1].username).toEqual(replies[1].username)
        expect(detailThread.comments[0].replies[1].date).toEqual(replies[1].created_at)
        expect(detailThread.comments[0].replies[1].content).toEqual('**balasan telah dihapus**')

    });
});
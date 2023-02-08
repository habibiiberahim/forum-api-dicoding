const DetailThread = require('../../Domains/threads/entities/DetailThread')
const DetailComment = require('../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../Domains/replies/entities/DetailReply')

class GetThreadDetailUseCase {
    constructor({threadRepository, commentRepository, replyRepository}) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
    }

    async execute(useCaseParams){
        const { threadId } = useCaseParams
        await this._threadRepository.verifyThreadIsExist(threadId);
        //return detail thread
        const thread = await this._threadRepository.getDetailThread(threadId);
        //return all comments
        const comments = await this._commentRepository.getCommentByThreadId(threadId)
        //return all replies
        const replies = await this._replyRepository.getRepliesByThreadId(threadId)

        const detailComments = comments.map(
            (item) => {
                const comment = new DetailComment({
                    id:item.id,
                    content: item.deleted_at === null ? item.content : '**komentar telah dihapus**',
                    date:item.created_at,
                    username:item.username,
                    replies:[],
                })

                return comment
            }
        )

        const detailThread = new DetailThread({
            id:thread.id,
            title:thread.title,
            body:thread.body,
            date:thread.created_at,
            username:thread.username,
            comments:detailComments
        })

        for (let i = 0; i < detailThread.comments.length; i++) {
            const commentId = detailThread.comments[i].id

            detailThread.comments[i].replies = replies
                .filter( (item) => item.comment_id === commentId )
                .map( (item) => {
                    const reply = new DetailReply({
                        id: item.id,
                        content: item.deleted_at === null ? item.content : '**balasan telah dihapus**',
                        date: item.created_at,
                        username: item.username,
                    })
                    return reply
                })
        }
        return detailThread
    }
}

module.exports = GetThreadDetailUseCase
const NewComment = require('../../Domains/comments/entities/NewComment')

class AddCommentUseCase {
    constructor({threadRepository, commentRepository, authenticationTokenManager}) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._authenticationTokenManager = authenticationTokenManager
    }

    async execute(useCasePayload, useCaseParams, id) {
        await this._threadRepository.verifyThreadIsExist(useCaseParams.threadId);
        const newComment = new NewComment({
            content:useCasePayload.content,
            thread_id:useCaseParams.threadId,
            owner:id
        })
        const result = await this._commentRepository.addComment(newComment)
        return result
    }
}

module.exports = AddCommentUseCase
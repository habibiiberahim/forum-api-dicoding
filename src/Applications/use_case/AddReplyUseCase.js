const NewReply = require('../../Domains/replies/entities/NewReply')

class AddReplyUseCase {
    constructor({replyRepository, commentRepository, threadRepository,authenticationTokenManager}) {
        this._replyRepository = replyRepository
        this._commentRepository = commentRepository
        this._threadRepository = threadRepository
        this._authenticationTokenManager = authenticationTokenManager
    }

    async execute(useCasePayload, useCaseParams, useCaseAuthorization) {
        const accessToken = await this._authenticationTokenManager.verifyTokenIsExist(useCaseAuthorization)
        await this._authenticationTokenManager.verifyAccessToken(accessToken)
        const {id} = await this._authenticationTokenManager.decodePayload(accessToken)
        await this._threadRepository.verifyThreadIsExist(useCaseParams.threadId)
        await this._commentRepository.verifyCommentIsExist(useCaseParams.commentId)
        const newReply = new NewReply({
            content: useCasePayload.content,
            owner: id,
            commentId:useCaseParams.commentId
        })
        const result = await this._replyRepository.addReply(newReply)
        return result
    }
}

module.exports = AddReplyUseCase
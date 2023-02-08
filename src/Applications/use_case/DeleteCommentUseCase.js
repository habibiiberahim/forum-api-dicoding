class DeleteCommentUseCase {
    constructor({threadRepository,commentRepository , authenticationTokenManager}) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._authenticationTokenManager = authenticationTokenManager
    }

    async execute(useCaseParams, useCaseAuthorization){
        const {threadId, commentId} = useCaseParams
        const accessToken = await this._authenticationTokenManager.verifyTokenIsExist(useCaseAuthorization)
        await this._authenticationTokenManager.verifyAccessToken(accessToken)
        const {id} = await this._authenticationTokenManager.decodePayload(accessToken)
        await this._threadRepository.verifyThreadIsExist(threadId);
        await this._commentRepository.verifyCommentIsExist(commentId);
        await this._commentRepository.verifyCommentOwner(commentId, id);
        await this._commentRepository.deleteComment(commentId);
    }
}

module.exports = DeleteCommentUseCase
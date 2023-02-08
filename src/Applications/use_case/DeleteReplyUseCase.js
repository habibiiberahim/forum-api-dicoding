class DeleteReplyUseCase {
    constructor({replyRepository,  authenticationTokenManager}) {
        this._replyRepository = replyRepository
        this._authenticationTokenManager = authenticationTokenManager
    }

    async execute(useCaseParams, useCaseAuthorization){
        const { replyId } = useCaseParams

        const accessToken = await this._authenticationTokenManager.verifyTokenIsExist(useCaseAuthorization)
        await this._authenticationTokenManager.verifyAccessToken(accessToken)
        const {id} = await this._authenticationTokenManager.decodePayload(accessToken)
        await this._replyRepository.verifyReplyIsExist(replyId)
        await this._replyRepository.verifyReplyOwner(replyId, id)
        await this._replyRepository.deleteReply(replyId)
    }
}

module.exports = DeleteReplyUseCase
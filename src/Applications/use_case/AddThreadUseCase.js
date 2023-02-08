const NewThread = require('../../Domains/threads/entities/NewThread')

class AddThreadUseCase {
    constructor({threadRepository, authenticationTokenManager}) {
        this._threadRepository = threadRepository
        this._authenticationTokenManager = authenticationTokenManager
    }

    async execute(useCasePayload, useCaseAuthorization) {
        const accessToken = await this._authenticationTokenManager.verifyTokenIsExist(useCaseAuthorization)
        await this._authenticationTokenManager.verifyAccessToken(accessToken)
        const {id} = await this._authenticationTokenManager.decodePayload(accessToken)
        const newThread = new NewThread({
            title:useCasePayload.title,
            body:useCasePayload.body,
            owner: id
        })

        const result = await this._threadRepository.addThread(newThread)
        return result
    }
}

module.exports = AddThreadUseCase
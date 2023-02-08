const ReplyRepository = require('../ReplyRepository')

describe('ReplyRepository Interface', function () {
    it('should throw error when invoke abstract behavior', async function () {
       //Arrange
        const replyRepository = new ReplyRepository()

        //Action and Arrange
        await expect(replyRepository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.verifyReplyIsExist('','')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.verifyReplyOwner('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.deleteReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.getRepliesByThreadId('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
const ThreadRepository = require("../../threads/ThreadRepository");
describe('ThreadRepository interface', function () {
    it('should throw error when invoke abstract behavior', async function () {
        // Arrange
        const threadRepository = new ThreadRepository();

        // Action and Assert
        await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');;
        await expect(threadRepository.verifyThreadIsExist('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');;
        await expect(threadRepository.getDetailThread('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');;
    });
});
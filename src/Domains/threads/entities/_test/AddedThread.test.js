const AddedThread = require('../AddedThread')

describe('a AddedThread entities', function () {
    it('should throw error when payload did not contain needed property', function () {
        // Arrange
        const payload = {
            id: 'thread-001',
            title: 'this is title',
        };

        // Action and Assert
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', function () {
        // Arrange
        const payload = {
            id: 'thread-001',
            title: 'this is title',
            owner: 123
        };

        // Action and Assert
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addedThread object correctly', function () {
        // Arrange
        const payload = {
            id: 'thread-001',
            title: 'this is title',
            owner: 'user-001'
        };

        // Action
        const {id, title, owner} = new AddedThread(payload)

        // Assert
        expect(id).toEqual(payload.id)
        expect(title).toEqual(payload.title)
        expect(owner).toEqual(payload.owner)
    });
});
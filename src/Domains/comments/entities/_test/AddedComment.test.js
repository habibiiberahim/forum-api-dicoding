const AddedComment = require('../AddedComment')

describe('a AddedComment entity', function () {
    it('should throw error when payload did not contain needed property', function () {
        // Arrange
        const payload = {
            id: 'thread-123',
            content: 'this is comment',
        };

        //Action and Assert
        expect(() => new  AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    it('should throw error when payload did not meet data type specification', function () {
        // Arrange
        const payload = {
            id: 'thread-123',
            content: 'this is comment',
            owner: 123
        };

        //Action and Assert
        expect(() => new  AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');

    });
    it('should create addedComment object correctly', function () {
        // Arrange
        const payload = {
            id: 'thread-123',
            content: 'this is comment',
            owner: 'user-123',
        };

        //Action
        const {id, content, thread_id, owner, created_at} = new AddedComment(payload)

        //Assert
        expect(id).toEqual(payload.id)
        expect(content).toEqual(payload.content)
        expect(thread_id).toEqual(payload.thread_id)
        expect(owner).toEqual(payload.owner)
        expect(created_at).toEqual(payload.created_at)
    });
});
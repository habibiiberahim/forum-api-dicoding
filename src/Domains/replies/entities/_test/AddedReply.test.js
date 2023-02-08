const AddedReply = require('../AddedReply')
describe('a AddedReply entity', function () {
    it('should throw error when payload did not contain needed property', function () {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'this is reply',

        };

        //Action and Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    });

    it('should throw error when payload did not meet data type specification', function () {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'this is reply',
            owner:{}
        };

        //Action and Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    });

    it('should create addedReply object correctly', function () {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'this is reply',
            owner:'user-123'
        };

        //Action
        const {id, content, owner} = new AddedReply(payload)

        //Assert
        expect(id).toEqual(payload.id)
        expect(content).toEqual(payload.content)
        expect(owner).toEqual(payload.owner)
    });
});
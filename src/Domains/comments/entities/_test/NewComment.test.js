const NewComment = require('../NewComment')

describe('a NewComment entity', function () {
    it('should throw error when payload did not contain needed property', function () {
        //Arrange
        const payload = {
            content:'this is comment'
        }

        // Action and Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    });

    it('should throw error when payload did not meet data type specification', function () {
        //Arrange
        const payload = {
            content:{},
            thread_id:'thread-123',
            owner:'user-123'
        }

        // Action and Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    });

    it('should create newComment object correctly', function () {
        //Arrange
        const payload = {
            content:'this is comment',
            thread_id:'thread-123',
            owner:'user-123'
        }

        // Action
        const { content, thread_id, owner} =  new NewComment(payload)

        //Assert
        expect(content).toEqual(payload.content)
        expect(thread_id).toEqual(payload.thread_id)
        expect(owner).toEqual(payload.owner)
    });
});
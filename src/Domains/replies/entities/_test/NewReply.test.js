const NewReply = require('../NewReply')
const NewComment = require("../../../comments/entities/NewComment");

describe('a NewReply entity', function () {
    it('should throw error when payload did not contain needed property', function () {
        //Arrange
        const payload = {
            content:'this is reply'
        }

        // Action and Assert
        expect( () => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', function () {
        //Arrange
        const payload = {
            content:{},
            commentId:'comment-123',
            owner:'user-123'
        }

        // Action and Assert
        expect( () => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    });

    it('should create newReply object correctly', function () {
        //Arrange
        const payload = {
            content:'this is comment',
            commentId:'thread-123',
            owner:'user-123'
        }

        // Action
        const { content, commentId, owner} =  new NewReply(payload)

        //Assert
        expect(content).toEqual(payload.content)
        expect(commentId).toEqual(payload.commentId)
        expect(owner).toEqual(payload.owner)
    });
});
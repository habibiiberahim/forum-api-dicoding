const DetailReply = require('../DetailReply')

describe('a DetailReply entity', function () {
    it('should throw error when payload did not contain needed property', function () {
        //Arrange
        const payload = {
            id:'reply-123',
            username:'john',
        }

        // Action and Assert
        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    });

    it('should throw error when payload did not meet data type specification', function () {
        //Arrange
        const payload = {
            id:'reply-123',
            username:'john',
            date:{},
            content:{}
        }

        // Action and Assert
        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    });

    it('should create detailReply object correctly', function () {
        //Arrange
        const payload = {
            id:'reply-123',
            username:'john',
            date:new Date(),
            content:'this is reply'
        }

        //Action
        const {id, username, date, content } = new DetailReply(payload)

        //Assert
        expect(id).toEqual(payload.id)
        expect(username).toEqual(payload.username)
        expect(date).toEqual(payload.date)
        expect(content).toEqual(payload.content)
    });
});
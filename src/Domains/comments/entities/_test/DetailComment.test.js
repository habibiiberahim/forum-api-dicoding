const DetailComment = require("../DetailComment");

describe('a DetailComment entity', function () {
    it('should throw error when payload did not contain needed property', function () {
        //Arrange
        const payload = {
            id:'user-123',
            username:'john',
        }

        // Action and Assert
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    });

    it('should throw error when payload did not meet data type specification', function () {
        //Arrange
        const payload = {
            id:'user-123',
            username:'john',
            date: new Date('2023-01-24T20:44:18.107Z'),
            content: {},
            replies:[],
        }

        // Action and Assert
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    });

    it('should create detailComment object correctly', function () {
        //Arrange
        const payload = {
            id:'user-123',
            username:'john',
            date: new Date('2023-01-24T20:44:18.107Z'),
            content:'comment',
            replies:[],
        }

        // Action
        const { id, username, date, content, replies, likeCount } =  new DetailComment(payload)

        //Assert
        expect(id).toEqual(payload.id)
        expect(username).toEqual(payload.username)
        expect(date).toEqual(payload.date)
        expect(content).toEqual(payload.content)
        expect(replies).toEqual(payload.replies)
    });
});
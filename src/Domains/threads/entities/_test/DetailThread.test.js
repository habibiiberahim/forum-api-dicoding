const DetailThread = require("../DetailThread");
const DetailComment = require("../../../comments/entities/DetailComment");
describe('a DetailThread entity', function () {
    it('should throw error when payload did not contain needed property', function () {
        //Arrange
        const payload = {
            id:'thread-123',
            title:'this is title',
            body: 'this is body',
        }

        // Action and Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    });
    it('should throw error when payload did not meet data type specification', function () {
        //Arrange
        const payload = {
            id:'thread-123',
            title:'this is title',
            body: 'this is body',
            date: new Date('2023-01-24T20:44:18.107Z'),
            username: {},
            comments: []
        }

        // Action and Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    });
    it('should create detailThread object correctly', function () {
        //Arrange
        const payload = {
            id:'thread-123',
            title:'this is title',
            body: 'this is body',
            date: new Date('2023-01-24T20:44:18.107Z'),
            username:'habibi',
            comments: []
        }

        //Action
        const { id, title, body, date, username, comments } = new DetailThread(payload)

        //Assert
        expect(id).toEqual(payload.id)
        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
        expect(date).toEqual(payload.date)
        expect(username).toEqual(payload.username)
        expect(comments).toEqual(payload.comments)
    });
});
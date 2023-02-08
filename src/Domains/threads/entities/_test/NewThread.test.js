const NewThread = require('../NewThread')

describe('a NewThread entity', function () {
    it('should throw error when payload did not contain needed property', function () {
        //Arrange
        const payload = {
            title:'this is title'
        }

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    });

    it('should throw error when payload did not meet data type specification', function () {
        //Arrange
        const payload = {
            title:'this is title',
            body:123,
            owner :'user-123'
        }

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    });

    it('should create newThread object correctly', function () {
        //Arrange
        const payload = {
            title:'this is title',
            body: 'this is body',
            owner:'user-001'
        }

        //Action
        const {title, body, owner } = new NewThread(payload)

        //Assert
        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
        expect(owner).toEqual(payload.owner)
    });
});
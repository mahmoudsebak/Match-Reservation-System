const app = require('../app');
const supertest = require('supertest');
var ObjectID = require('mongodb').ObjectID;
const User = require('../models/User');
const Match = require('../models/Match');
const Stadium = require('../models/Stadium.js')
const request = supertest(app);

jest.setTimeout(20000);

var userToken = null, managerToken = null, matchID = null, user = {}, manager = {}, match = {}, stadium = {};
beforeAll( async() => {

    user = {
        username: 'msebak',
        first_name: 'mahmoud',
        last_name: 'sebak',
        email: 'mahmoud@gmail.com',
        password: '123456789',
        birthdate : Date.now(),
        gender : 'male',
        city : 'cairo',
        role : 0,
        tokens: [],
        approved: 1
    }
    await (new User(user)).save()
    res = await request.post('/users/signin')
        .send({email: 'mahmoud@gmail.com', password: '123456789'})
    userToken = res.body.token

    manager = {
        username: 'mahmoudsebak',
        first_name: 'mahmoud',
        last_name: 'sebak',
        email: 'mahmoud22@gmail.com',
        password: '123456789',
        birthdate : Date.now(),
        gender : 'male',
        city : 'cairo',
        role : 1,
        tokens: [],
        approved: 1
    }
    await (new User (manager)).save()
    res = await request.post('/users/signin')
        .send({email: 'mahmoud22@gmail.com', password: '123456789'})
    managerToken = res.body.token

    stadium = {
        name : "Borg Alarab",
        VIP_area_rows : "10",
        VIP_area_seats_per_row: "10",
        normal_area_rows: "100",
        seats_per_row : "100"
    }
    const stadium1 = new Stadium(stadium)
    res = await stadium1.save()
    stadiumID = res._id

    match = {
        home_team: "Ahly",
        away_team: "Zamalek",
        match_venue: stadiumID,
        date: Date.now(),
        main_referee: "Ahmed",
        line_man1: "Mohamed",
        line_man2: "Mahmoud"
    }
    const match1 = new Match(match)
    res = await match1.save()
    matchID = res._id

});

afterAll( async() => {
    // await User.deleteMany({})
    // await Match.deleteMany({})
    // await Stadium.deleteMany({})
});

describe('Manager', ()=> {

    it('Add Match from manager account', async ()=> {
        await request.post('/manager/match')
        .set('Authorization', managerToken)
        .send(match).expect(201)
    });

    it('Add Match from user account', async ()=> {
        await request.post('/manager/match')
        .set('Authorization', userToken)
        .send(match).expect(401)
    });

    it('Add Stadium from manager account', async ()=> {
        stadium.name = "Cairo"
        await request.post('/manager/stadium')
        .set('Authorization', managerToken)
        .send(stadium).expect(201)
    });

    it('Add Stadium from user account', async ()=> {
        await request.post('/manager/stadium')
        .set('Authorization', userToken)
        .send(stadium).expect(401)
    });

    it('Get a match with valid match id', async ()=> {
        await request.get('/manager/match/' + matchID).expect(200)
    });

    it('Get a match with invalid match id', async ()=> {
        await request.get('/manager/match/' + new ObjectID()).expect(400)
    });

    it('Update Match from manager account', async ()=> {
        await request.patch('/manager/match/' + matchID)
        .set('Authorization', managerToken)
        .send({away_team: "Zamalek"}).expect(200)
    });

    it('Update Match from user account', async ()=> {
        await request.patch('/manager/match/' + matchID)
        .set('Authorization', userToken)
        .send({away_team: "Aswan"}).expect(401)
    });

    it('Update Match with invalid match id', async ()=> {
        await request.patch('/manager/match/' + new ObjectID())
        .set('Authorization', managerToken)
        .send({away_team: "Aswan"}).expect(400)
    });

    it('Get match seats with valid match id', async ()=> {
        await request.get('/manager/seats/' + matchID).expect(200)
    });

    it('Get match seats with invalid match id', async ()=> {
        await request.get('/manager/seats/' + new ObjectID()).expect(400)
    });
});
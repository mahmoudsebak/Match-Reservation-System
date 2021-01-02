const app = require('../app');
const supertest = require('supertest');
var ObjectID = require('mongodb').ObjectID;
const request = supertest(app);

jest.setTimeout(20000);

var userToken = null, managerToken = null, matchID = null;
beforeAll( async() => {
    res = await request.post('/users/signin')
        .send({
            email: "mahmoud.sebak1998@gmail.com",
            password: "sebak123"
        })
    managerToken = res.body.token;
    res = await request.post('/users/signin')
    .send({
        email: "sebak@gmail.com",
        password: "sebak123"
    })
    userToken = res.body.token;
    res = await request.post('/manager/match')
        .set('Authorization', managerToken)
        .send({
            home_team: "Ahly",
            away_team: "Ghazl elmahala",
            match_venue: "5fe89d5efdfe513fd9f0fecd",
            date: "2020-10-10T22:00:00.000+00:00",
            main_referee: "Ahmed",
            line_man1: "Mohamed",
            line_man2: "Mahmoud"
        })
    matchID = res.body.match._id;
    console.log(matchID)
});

describe('Manager', ()=> {

    it('Add Match from manager account', async ()=> {
        await request.post('/manager/match')
        .set('Authorization', managerToken)
        .send({
            home_team: "Ahly",
            away_team: "Ghazl elmahala",
            match_venue: "5fe89d5efdfe513fd9f0fecd",
            date: "2020-10-10T22:00:00.000+00:00",
            main_referee: "Ahmed",
            line_man1: "Mohamed",
            line_man2: "Mahmoud"
        }).expect(201)
    });

    it('Add Match from user account', async ()=> {
        await request.post('/manager/match')
        .set('Authorization', userToken)
        .send({
            home_team: "Ahly",
            away_team: "Aswan",
            match_venue: "5fe89d5efdfe513fd9f0fecd",
            date: "2020-10-10T22:00:00.000+00:00",
            main_referee: "Ahmed",
            line_man1: "Mohamed",
            line_man2: "Mahmoud"
        }).expect(401)
    });

    it('Add Stadium from manager account', async ()=> {
        await request.post('/manager/stadium')
        .set('Authorization', managerToken)
        .send({
            name: Math.random().toString(36).substring(7),
            VIP_area_rows: "10",
            seats_per_row: "100"
        }).expect(201)
    });

    it('Add Stadium from user account', async ()=> {
        await request.post('/manager/stadium')
        .set('Authorization', userToken)
        .send({
            name : "Borg Alarab",
            VIP_area_rows : "10",
            seats_per_row : "100"
        }).expect(401)
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
        .send({
            away_team: "Zamalek"
        }).expect(200)
    });

    it('Update Match from user account', async ()=> {
        await request.patch('/manager/match/' + matchID)
        .set('Authorization', userToken)
        .send({
            away_team: "Aswan"
        }).expect(401)
    });

    it('Update Match with invalid match id', async ()=> {
        await request.patch('/manager/match/' + new ObjectID())
        .set('Authorization', managerToken)
        .send({
            away_team: "Aswan"
        }).expect(400)
    });

    it('Get match seats with valid match id', async ()=> {
        await request.get('/manager/seats/' + matchID).expect(200)
    });

    it('Get match seats with invalid match id', async ()=> {
        await request.get('/manager/seats/' + new ObjectID()).expect(400)
    });
});
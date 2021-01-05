const app = require('../app');
const supertest = require('supertest');
const User = require('../models/User')
const Match = require('../models/Match');
const Stadium = require('../models/Stadium.js');
const Reservation = require('../models/Reservation');
const request = supertest(app);

jest.setTimeout(20000);

var userId = null, managerToken = null, matchID = null,reservationId = null, manager = {}, match = {}, stadium = {}, reservation = {};
beforeAll( async() => {

    await User.deleteMany({})
    await Match.deleteMany({})
    await Stadium.deleteMany({})
    await Reservation.deleteMany({})

    manager = {
        username: 'mazen123',
        first_name: 'mazen',
        last_name: 'fawzy',
        email: 'mazen@gmail.com',
        password: '147852369',
        birthdate : Date.now(),
        gender : 'male',
        city : 'cairo',
        role : 1,
        tokens: [],
        approved: 1
    }
    await (new User (manager)).save()
    res = await request.post('/users/signin')
        .send({email: 'mazen@gmail.com', password: '147852369'})

    managerToken = res.body.token
    userId = res.body.user._id

    stadium = {
        name : "Cairo",
        VIP_area_rows : "5",
        VIP_area_seats_per_row: "5",
        normal_area_rows: "6",
        seats_per_row : "6"
    }
    const stadium1 = new Stadium(stadium)
    res = await stadium1.save()
    stadiumID = res._id

    match = {
        home_team: "Enpy",
        away_team: "Wadi Degla",
        match_venue: stadiumID,
        date: Date.now(),
        main_referee: "mazen",
        line_man1: "ayman",
        line_man2: "El kashif"
    }
    const match1 = new Match(match)
    const normalSeats =
    Array.from({ length: res.normal_area_rows }, () => 
    Array.from({ length: res.seats_per_row }, () => false));
    
    const VIPSeats =
    Array.from({ length: res.VIP_area_rows }, () => 
    Array.from({ length: res.VIP_area_seats_per_row }, () => false));

    match1.set('normal_seats', normalSeats)
    match1.set('vip_seats', VIPSeats)

    res = await match1.save()
    matchID = res._id
    
    reservation = {
        owner : userId,
        match : matchID,
        is_VIP: 0,
        seat_row : 2,
        seat_col : 2
    }
    const reservation1 = new Reservation(reservation)
    res = await reservation1.save()
    reservationId = res._id
    
    var reservation2 = {
        owner : userId,
        match : matchID,
        is_VIP: 1,
        seat_row : 1,
        seat_col : 1
    }
    const reserve2= new Reservation(reservation2)
    reserve2.set("createdAt","2020-01-01")
    res = await reserve2.save()
    reservationId2 = res._id

    var reservation3 = {
        owner : userId,
        match : matchID,
        is_VIP: 1,
        seat_row : 0,
        seat_col : 0
    }
    const reserve3= new Reservation(reservation3)
    res = await reserve3.save()
    reservationId3 = res._id
});

afterAll( async() => {
    await User.deleteMany({})
    await Match.deleteMany({})
    await Stadium.deleteMany({})
    await Reservation.deleteMany({})
});

describe('User Edit Data Functionality', ( )=>{
    it(" User Edit Data with valide parameter",async ()=>{
        return request.patch("/fans/editdata")
        .set("authorization",managerToken)
        .send({
            "gender":"female"
        }).then( x => {
            expect(x.status).toBe(200);
        });

    });

    it(" User Edit Data with invalid parameter",async ()=>{
        await request.patch("/fans/editdata")
        .set("authorization",managerToken)
        .send({
            "gender123":"female"
        }).expect(400)
    });

    it(" User Edit Data with valid parameter and wrong input formate",async ()=>{
        await request.patch("/fans/editdata")
        .set("authorization",managerToken)
        .send({
            "birthdate":""
        }).expect(400)
    });

    it("get all match details",async ()=>{
        await request.post("/fans/getallmatches")
        .set("authorization",managerToken)
        .send({"name":""})
        .expect(200)
    });

    it("book a ticket for vip seat with invalid id",async ()=>{
        await request.post("/fans/addreservation")
        .set("authorization",managerToken)
        .send({
                "owner":"fnjf4bfi4ub4ufng4g9",
                "match":matchID,
                "is_VIP":1,
                "seat_row":1,
                "seat_col":1
        })
        .expect(400)
    });

    it("book a ticket for normal seat",async ()=>{
        await request.post("/fans/addreservation")
        .set("authorization",managerToken)
        .send({
                "owner":userId,
                "match":matchID,
                "is_VIP":0,
                "seat_row":3,
                "seat_col":3
        }).expect(200)
    });

    it("book a ticket for normal seat which is not empty",async ()=>{
        await request.post("/fans/addreservation")
        .set("authorization",managerToken)
        .send({
                "owner":userId,
                "match":matchID,
                "is_VIP":0,
                "seat_row":6,
                "seat_col":6
        }).expect(400)
    });

    it("Cancel Reservation of vip seat but expired",async()=>{
        await request.delete("/fans/cancelreservation").
        set("authorization",managerToken).
        send({
            "reservation_id":reservationId2
        }).expect(400)
    });

    it("Cancel Reservation of Vip seat",async()=>{
        await request.delete("/fans/cancelreservation").
        set("authorization",managerToken).
        send({
            "reservation_id":reservationId3
        }).expect(200)
    });

    it("Cancel Reservation with valid ID of normal",async()=>{
        await request.delete("/fans/cancelreservation").
        set("authorization",managerToken).
        send({
            "reservation_id":reservationId
        }).expect(200)
    });

    it("Cancel Reservation with invalid id",async()=>{
        await request.delete("/fans/cancelreservation").
        set("authorization",managerToken).
        send({
            "reservation_id":"knr3f322ffg23g"
        }).expect(400)
    });
});

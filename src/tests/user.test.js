const app = require('../app');
const supertest = require('supertest');
const { TestScheduler } = require('jest');
const request = supertest(app);
const User = require('../models/User')
const Adminstrator = require('../models/Adminstrator')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

let user = {} 

beforeEach(async () => {
    user = {
        username: 'ahmed_essam',
        first_name: 'ahmed',
        last_name: 'essam',
        email: 'ahmed.ed@gmail.com',
        password: '123456789',
        birthdate : Date.now(),
        gender : 'male',
        city : 'cairo',
        role : 0,
        tokens: []
    }

    await User.deleteMany()
})


test('Signup successfully..', async () => {
    await request.post('/users/signup')
    .send(user)
    .expect(201)
})

test('Signup bad request..', async () => {
    delete user.username
    await request.post('/users/signup')
    .send(user)
    .expect(400)
})

test('Signup invalid email..', async () => {
    user.email = 'ahmed'
    const res = await request.post('/users/signup')
    .send(user)
    .expect(400)
})

test('Signup bad password..', async () => {
    user.password = '1234567'
    const res = await request.post('/users/signup')
    .send(user)
    .expect(400)
})

test('Signup (if approved sent true ignore it!)..', async () => {
    user.approved = true
    const res = await request.post('/users/signup')
    .send(user)
    .expect(201)
    const saved_user = await User.findOne({email: user.email})
    expect(saved_user.approved).toBeFalsy()
})

test('Signin user wrong email..', async () => {
    const user1 = new User(user)
    await user1.save()
    const res = await request.post('/users/signin')
    .send({ email: 'ahmed.eed@gmail.com', password: '123456789'})
    .expect(404)
    expect(res.body.error).toBeTruthy()
    expect(res.body.message).toMatch('Wrong email!')
})

test('Signin user wrong password..', async () => {
    const user1 = new User(user)
    await user1.save()
    const res = await request.post('/users/signin')
    .send({ email: 'ahmed.ed@gmail.com', password: '12345678999'})
    .expect(404)
    expect(res.body.error).toBeTruthy()
    expect(res.body.message).toMatch('Wrong password!')
})

test('Signin user not approved by the adminstrator yet!..', async () => {
    const user1 = new User(user)
    await user1.save()
    const res = await request.post('/users/signin')
    .send({ email: 'ahmed.ed@gmail.com', password: '123456789'})
    .expect(404)
    expect(res.body.error).toBeTruthy()
    expect(res.body.message).toMatch('Not approved by the Adminstrator yet, try later!')
})

test('Signin successfully..', async () => {
    user.approved = true
    const user1 = new User(user)
    await user1.save()
    
    const res = await request.post('/users/signin')
    .send({ email: 'ahmed.ed@gmail.com', password: '123456789'})
    .expect(200)
    
    const signedin_user = await User.findOne({email : 'ahmed.ed@gmail.com'})
    expect(res.body.error).toBeFalsy()
    expect(res.body.token).toBe(signedin_user.tokens[0].token)
})

test('logout sucessfully..', async () => {
    user.approved = true
    user._id = mongoose.Types.ObjectId()
    user.tokens.push({ 
        token: jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn : '7 days'})
    })
    const user1 = new User(user)
    await user1.save()
    await request.post('/users/logout')
    .set('authorization', `Bearer ${user.tokens[0].token}`)
    .expect(200)

    user = await User.findById(user._id)
    expect(user.tokens[0]).toBeUndefined()
    
})

test('logout unauthorized..', async () => {
    user.approved = true
    user._id = mongoose.Types.ObjectId()
    const user1 = new User(user)
    await user1.save()

    const res = await request.post('/users/logout')
    .expect(401)    

    expect(res.body.error).toBeTruthy()
    expect(res.body.message).toBe('Not Authorized!')
})


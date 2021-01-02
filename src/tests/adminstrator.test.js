const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);

jest.setTimeout(20000);

describe('Admin', ()=> {
    it('Signin() ', async ()=> {
        await request.post('/adminstrator/signin')
        .send({
            email: "filo@yahoo.com",
            password: "1234"
        }).expect(404);
    });  

});
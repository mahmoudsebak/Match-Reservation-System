const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);
const Admin = require('../models/Adminstrator.js');
const User = require('../models/User.js');
const mongoose = require('mongoose')

describe('Admin', ()=> {
    
    let admin;
    let unapproved;

    beforeAll(async () => {
        
        await Admin.deleteMany();
        await User.deleteMany();

        unapproved = new User({
            username: "Philo",
            first_name: "Philopateer",
            last_name: "Nabil",
            email: "philo@gmail.com",
            password: "12345678",
            birthdate: Date.now(),
            gender: "male",
            city: "helwan",
            address: "amtdad",
            role: false,
            approved: false,
            tokens: {
                token: "foo"
            }
        });
        unapproved = await unapproved.save(); 

        admin = new Admin({
            email: "filo@yahoo.com",
            password: "12345678",
            token: "eyJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1ZmVmNDdiOTg2Zjc5MjMwYjA0ZWM5NDgiLCJpYXQiOjE2MDk1MTY5ODUsImV4cCI6MTYwOTYwMzM4NX0.6isPwXvh4fQuJQPUbP_Nz-OQn8OZ2MyRULqd_GvkKUI"
        });
        await admin.save();
    })    

    describe('Adminsave() ', ()=> {
        it('should return wrong email format', async () => {
            let wrong_admin = new Admin({
                email: 'foo',
                password: "12345678"
            });
            await expect(wrong_admin.save()).rejects.toThrowError(mongoose.Error.ValidationError);
        });

        it('should return worng password format', async () => {
            let wrong_admin = new Admin({
                email: 'foo@yahoo.com',
                password: "1234"
            });
            await expect(wrong_admin.save()).rejects.toThrowError(mongoose.Error.ValidationError);
        });
    });

    describe('Auth() ', ()=> {
        it('Should return unauthorized',async ()=> {
            await request.patch('/adminstrator/approve/'+ unapproved._id)
            .expect(401);
        });

        it('Should refuse fake tokens', async ()=> {
            await request.patch('/adminstrator/approve/'+ unapproved._id)
            .set('authorization', 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmYwZjIyN2FlNWMzNTZhNzQ0ZDk4MmQiLCJpYXQiOjE2MDk2MjYxNTEsImV4cCI6MTYwOTcxMjU1MX0.gXMwS9HOk_mrLy8VCR0Hy-hPpn_6BcRA4a8rSft2kmo")
            .expect(401);
        });
        
    });


    describe('Signin() ', ()=> {

        it('Should return wrong email', async()=> {
            await request.post('/adminstrator/signin')
            .send({
                email: "f@yahoo.com",
                password: "12345"
            }).expect(404, {
                error: true,
                message: "Wrong email!"
            });
        });

        it('Should return wrong password', async()=> {
            await request.post('/adminstrator/signin')
            .send({
                email: "filo@yahoo.com",
                password: "12387"
            }).expect(404, {
                error: true,
                message: "Wrong password!"
            });
        });

        it('Should sign in successfully', async()=> {
            let res = await request.post('/adminstrator/signin')
            .send({
                email: "filo@yahoo.com",
                password: "12345678"
            });
            admin.token = res.body.token;
            console.log(admin.token);
            expect(res.status).toBe(200);
        });

    });  

    describe('adminapprove()', ()=> {
        
        it('Should be approved sucessfully', async () => {
            await request.patch('/adminstrator/approve/'+ unapproved._id)
            .set('authorization', 'Bearer ' + admin.token)
            .expect(201)
        });

        
        it('Should return User Not Found!', async () => {
            await request.patch('/adminstrator/approve/5ff07a073b9f544e68e1a896')
            .set('authorization', 'Bearer ' + admin.token)
            .expect(404);
        });
        
        it('Should return internal server error', async() => {
            let original = User.findOneAndUpdate;
            User.findOneAndUpdate = jest.fn( x => {throw new error()});
            await request.patch('/adminstrator/approve/5ff07a073b9f544e68e1a896')
            .set('authorization', 'Bearer ' + admin.token)
            .expect(500);

            user.findOneAndUpdate = original;
        });
    });

    describe('deleteuser()', () => {
        it('User not found', async ()=> {
            await request.delete('/adminstrator/deleteUser/5ff07a073b9f544e68e1a896')
            .set('authorization', 'Bearer ' + admin.token)
            .expect(404);
        });

        it('Internal server error', async ()=> {
            let original = User.findByIdAndDelete;
            User.findByIdAndDelete = jest.fn( x => { throw new error();})
            await request.delete('/adminstrator/deleteUser/5ff07a073b9f544e68e1a896')
            .set('authorization', 'Bearer ' + admin.token)
            .expect(500);

            User.findByIdAndDelete = original;
        });

        it('User should be deleted', async ()=> {
            await request.delete('/adminstrator/deleteUser/' + unapproved._id)
            .set('authorization', 'Bearer ' + admin.token)
            .expect(200);
        });
    });

    describe('forceadmin()', ()=> {
        it('should add new admin successfully', async ()=> {
            await request.post('/forceadmin')
            .send({
                email: "filo@gmail.com",
                password: "12345678"
            }).expect(201);
        });

        it('Should fail to force same admin', async ()=> {
            await request.post('/forceadmin')
            .send({
                email: "filo@gmail.com",
                password: "12345678"
            }).expect(400);
        });

    });

    describe('logout()', ()=> {
        
        /*
        it('Should give internal server error', async ()=> {
            
            let original = Admin.save;
            Admin.save = jest.fn( x => { throw new error();})

            await request.post('/adminstrator/logout')
            .set('authorization', 'Bearer ' + admin.token)
            .expect(500);

            Admin.save = original;
        });
        */

        it('should sign out successfully', async ()=> {
            await request.post('/adminstrator/logout')
            .set('authorization', 'Bearer ' + admin.token)
            .expect(200);
        });

    });

});
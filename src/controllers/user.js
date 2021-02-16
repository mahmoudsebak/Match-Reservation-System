const User = require('../models/User.js')
const Match = require('../models/Match.js')
const Stadium = require('../models/Stadium.js')
const Reservation = require('../models/Reservation.js')
const escapeStringRegexp = require('escape-string-regexp');

const userSignup =  async (req, res) => {
    try {
        const user_ = { ...req.body }
        if(req.body.approved){
            user_.approved = false
        }
        const user = new User(user_)
        await user.save()
        res.status(201).send({user : user, error : false})
    } catch (error) {
        res.status(400).send({ error : true, "message" : error.message})
    }
}

const userSignin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findByCredentials(email, password)
        const token = await user.generateToken()
        res.status(200).send({error : false, token : token, user : user})
    } catch (error) {
        res.status(404).send({error : true, message : error.message})
    }
}

const userLogout = async (req, res) => {
    const user = req.user
    user.tokens = user.tokens.filter( (token) => {
        if(token.token !== req.token) return true 
    })
    try {
        await user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
    
}

const getUsers = async (req, res) => {
    if(!req.query.username){
        res.status(400).send({error: true})
    }
    else {
        try{
            const $regex = escapeStringRegexp(req.query.username);
            const users = await User.find({ username: { $regex } });
            res.send({ error: false, users: users})
        } catch(error){
            res.status(500).send({error: true, message: error.message})
        }
    }
    
    
}

module.exports = {
    userSignin,
    userSignup,
    userLogout,
    getUsers
}
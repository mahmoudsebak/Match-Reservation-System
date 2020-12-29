const User = require('../models/User.js')
const Match = require('../models/Match.js')
const Stadium = require('../models/Stadium.js')
const Reservation = require('../models/Reservation.js')

const userSignup =  async (req, res) => {
    try {
        const user = new User(req.body)
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
        res.status(400).send({error : true, message : error.message})
    }
}

const userLogout = async (req, res) => {
    const user = req.user
    user.tokens = user.tokens.filter( (token) => {
        if(token.token !== req.token) return true 
    })
    console.log(user.tokens)
    try {
        await user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
    
}

module.exports = {
    userSignin,
    userSignup,
    userLogout
}
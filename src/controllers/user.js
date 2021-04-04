const User = require('../models/User.js')
const Match = require('../models/Match.js')
const Stadium = require('../models/Stadium.js')
const Reservation = require('../models/Reservation.js')

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

const checkUser = async (req, res) => {
    try {
        const username = req.params.username
        const result = await User.find({"username": username});
        if(result)
            res.status(200).send({error : false, free: false});
        else
            res.status(200).send({error : false, free: true});
    } catch (error) {
        res.status(404).send({error : true, message : error.message})
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

const getUserData = async(req,res)=>{
    try{
    console.log(req.user)
    res.status(200).json({user: req.user})
    }catch(e){
        res.status(400).send({e :true , message: e.message})
    }
}

module.exports = {
    userSignin,
    userSignup,
    userLogout,
    checkUser,
    getUserData
}
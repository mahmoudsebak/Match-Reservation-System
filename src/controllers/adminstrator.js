const User = require('../models/User.js')
const Match = require('../models/Match.js')
const Stadium = require('../models/Stadium.js')
const Reservation = require('../models/Reservation.js')
const Admin = require('../models/Adminstrator.js')


const adminSignin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const admin = await Admin.findByCredentials(email, password)
        const token = await admin.generateToken()
        res.status(200).send({error : false, token : token, admin : admin})
    } catch (error) {
        res.status(400).send({error : true, message : error.message})
    }
}

const adminApprove = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findOneAndUpdate({_id : userId}, { $set: { approved: true}})
        if(!user){
            res.status(404).send({error : true, message : "User Not Found!"})
        }
        res.status(201).send({error : false, user : user})
    } catch (error) {
        res.status(500).send({error : true, message : error.message})
    }   
}

const adminLogout = async (req, res) => {
    const admin = req.admin
    admin.token = ""
    try {
        await admin.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send({error:true, message: error.message})
    }
}

const forceAdmin = async (req, res) => {
    const admin = new Admin(req.body)
    try{
        await admin.save()
        res.status(201).send(admin)
    } catch(error){
        res.status(400).send({error : true, message : error.message})
    }
}

const deleteUser = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findByIdAndDelete(userId)
        if(!user){
            res.status(404).send({error : true, message : "User Not Found!"})
        }
        res.status(200).send({error : false, user : user})    
    } catch (error) {
        res.status(500).send({error:true, message:error.message})
    }
     
}

module.exports = {
    adminSignin,
    adminApprove,
    adminLogout,
    deleteUser,
    forceAdmin
}
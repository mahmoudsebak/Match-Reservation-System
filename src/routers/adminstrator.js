const express = require('express')
const auth = require('../middleware/admin_auth')
const router = new express.Router()
const Admin = require('../models/Adminstrator.js')
const User = require('../models/User.js')

// Write APIs here ......
router.post('/adminstrator/signin', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const admin = await Admin.findByCredentials(email, password)
        const token = await admin.generateToken()
        res.status(200).send({error : false, token : token, admin : admin})
    } catch (error) {
        res.status(400).send({error : true, message : error.message})
    }
})

router.patch('/adminstrator/approve/:id', auth, async (req, res) => {
    const user_id = req.params.id
    try {
        const user = await User.findOneAndUpdate({_id : user_id}, { $set: { approved: true}})
        if(!user){
            res.status(404).send({error : true, message : "User Not Found!"})
        }
        res.status(201).send({error : false, user : user})
    } catch (error) {
        res.status(500).send({error : true, message : error.message})
    }   
})


// To be removed when writing a script to force admin in db
router.post('/forceadmin', async (req, res) => {
    const admin = new Admin(req.body)
    await admin.save()
    res.status(201).send(admin)
})

module.exports = router
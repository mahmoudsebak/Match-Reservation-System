const jwt = require('jsonwebtoken')
const Admin = require('../models/Adminstrator.js')

const auth = async (req, res, next) => {
    try{
        const token = req.headers['authorization'].replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({'_id' : decoded._id, 'token' : token })
        if(!admin){
            throw new Error()
        }
        req.admin = admin
        req.token = token
        next()
    } catch(e){
        res.status(401).send('Not Authorized!')
    }
}

module.exports = auth
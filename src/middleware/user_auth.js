const jwt = require('jsonwebtoken')
const User = require('../models/User.js')
const AppError = require('../app_error')


const auth = async (req, res, next) => {
    try{
        const token = req.headers['authorization'].replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({'_id' : decoded._id, 'tokens.token' : token })
        if(!user)
            throw new AppError('Not Authorized', 401)
        req.user = user
        req.token = token
        next()
    } catch(e){
        res.status(401).send({error:true, message:'Not Authorized!'})
    }
}

module.exports = auth
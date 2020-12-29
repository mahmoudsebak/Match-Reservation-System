const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Reservation = require('./Reservation')

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    first_name : {
        type : String,
        required : true,
    },
    last_name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email!')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        validate(value){
            if(value.length < 8){
                throw new Error("Password must be at least 8 characters long!")
            }
        } 
    },
    birthdate : {
        type : Date,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    address : {
        type : String    
    },
    role : {
        type : Boolean, // 1 for manager and 0 for fan
        required : true
    },
    approved : {
        type : Boolean, // true if approved by the IT adminstrator
        default : false,
    },
    tokens : [
        {
            token : {
                type : String
            }
        }
    ]


})

//hide private data
userSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password
    delete user.tokens
    return user
}

userSchema.virtual('reservations', {
    ref : 'Reservation',
    localField : '_id',
    foreignField : 'owner'
})

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    await Reservation.deleteMany({owner : user._id})
    next()
})

userSchema.methods.generateToken = async function (){
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn : '7 days'})
    user.tokens.push({token : token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Wrong email!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Wrong password!')
    }
    if(!user.approved){
        throw new Error('Not approved by the Adminstrator yet, try later!')
    }
    return user
}

const User = mongoose.model('User', userSchema)
module.exports = User
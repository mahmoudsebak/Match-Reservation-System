const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


adminSchema = mongoose.Schema({
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
    token : String
})

//hide private data
adminSchema.methods.toJSON = function(){
    const admin = this.toObject()
    delete admin.password
    delete admin.token
    return admin
}

adminSchema.pre('save', async function(next) {
    const admin = this
    if(admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
})

adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email })
    if(!admin){
        throw new Error('Wrong email!')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if(!isMatch){
        throw new Error('Wrong password!')
    }
    return admin
}

adminSchema.methods.generateToken = async function(){
    const admin = this
    const token = jwt.sign({_id: admin._id}, process.env.JWT_SECRET, {expiresIn : '1 days'})
    admin.token = token
    await admin.save()
    return token
}


const Admin = mongoose.model('Adminstrator', adminSchema)
module.exports = Admin
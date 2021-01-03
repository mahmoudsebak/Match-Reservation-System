const mongoose = require('mongoose')
const Match = require('./Match')

const stadiumSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    VIP_area_rows : {
        type : Number,
        required : true
    },
    VIP_area_seats_per_row : {
        type : Number,
        required : true
    },
    normal_area_rows : {
        type : Number,
        required : true
    },
    seats_per_row : {
        type : Number,
        required : true
    }
})

stadiumSchema.virtual('matches', {
    ref : 'Match',
    localField : '_id',
    foreignField : 'match_venue' 
 })

 stadiumSchema.pre('remove', async (next) => {
     const stadium = this
     await Match.deleteMany({match_venue : stadium._id})
     next()
 })

const Stadium = mongoose.model('Stadium', stadiumSchema)
module.exports = Stadium
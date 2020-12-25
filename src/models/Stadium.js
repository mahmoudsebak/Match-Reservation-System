const mongoose = require('mongoose')

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

const Stadium = mongoose.model('Stadium', stadiumSchema)
module.exports = Stadium
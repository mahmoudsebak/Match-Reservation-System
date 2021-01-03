const mongoose = require('mongoose')
const Reservation = require('./Reservation')
const stadiam = require('./Stadium')

const matchSchema = mongoose.Schema({
    home_team : {
        type : String,
        required : true
    },
    away_team : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true,
    },
    match_venue : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Stadium'
    },
    main_referee : {
        type : String,
        required : true
    },
    line_man1 : {
        type : String,
        required : true
    },
    line_man2 : {
        type : String,
        required : true
    }
},{
    strict:false,
    timestamps: true,
    toJSON: {virtuals: true}
})

matchSchema.virtual('reservations', {
    ref : 'Reservation',
    localField : '_id',
    foreignField : 'match'
})

matchSchema.pre('remove', async function(next) {
    const match = this
    await Reservation.deleteMany({match : match._id})
    next()
})


const Match = mongoose.model('Match', matchSchema)
module.exports = Match
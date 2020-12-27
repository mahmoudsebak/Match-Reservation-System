const mongoose = require('mongoose')

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
        type : Date
        //required : true,
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
    timestamps: true,
    toJSON: {virtuals: true}
})

matchSchema.virtual('reservations', {
    ref : 'Reservation',
    localField : '_id',
    foreignField : 'match'
})

const Match = mongoose.model('Match', matchSchema)
module.exports = Match
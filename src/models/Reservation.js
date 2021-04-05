const { Mongoose } = require("mongoose");

const mongoose = require('mongoose')

const reservationShema = mongoose.Schema({
    
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    match : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Match'
    },
    seat_row : {
        type : Array,
        required : true
    },
    seat_col : {
        type : Array,
        required : true
    },
    seats : {
        type :Array,
        required : false
    }
},{
    strict : false,
    timestamps : true
})
reservationShema.index({match : 1, owner : 1}, {unique : true})
const Reservation = mongoose.model('Reservation', reservationShema)
Reservation.syncIndexes();
module.exports = Reservation

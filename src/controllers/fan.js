const User = require('../models/User.js')
const Match = require('../models/Match.js')
const Stadium = require('../models/Stadium.js')
const Reservation = require('../models/Reservation.js')
const { update } = require('../models/Reservation.js')
const mongoose = require('mongoose')


const editUserData = async (req ,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates=
    ['first_name', 'last_name','gender', 
    'birthdate','city','address', 'role','password']
    const isValidUpdate=updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send({error:'Invalid Update'})
    }
    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
}
const getAllMatches = async(req,res)=>{
    try{
    allMatches = await Match.find()
    res.status(200).json({matches:allMatches})
    }catch(e){
        res.status(400).send({error :true , message: e.message})
    }
}
const bookTicket = async (req, res, next) => {
  console.log(req.body);
  const session = await mongoose.startSession()
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
};
  try{
    const result= await session.withTransaction(async () => {
        
      for (i = 0; i < req.body.seats.length; i++) {
          const row = req.body.seats[i].seat_row;
          const col = req.body.seats[i].seat_col;
          slot = {}
          ObjectId = require('mongodb').ObjectId
          id = new ObjectId(req.body.match);
          vipSeats= `vip_seats.${row}.${col}`.toString()
          let query={}
          query["_id"]=id
          query[vipSeats]=false
  
          let update={}
          update[vipSeats]=true
          slot = await Match.findOneAndUpdate(query, {$set: update}, { useFindAndModify: false ,session:session})
  
          if (!slot){
            await session.abortTransaction()
            throw new Error('Seat is not available')
          } 
          
        }
  
        const reservation = await new Reservation(req.body)
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
  
  
  
        hashCode = function(s){
          return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
        }
        
        ticketNumber = Math.abs(hashCode(timestamp.toString()+(req.body.owner).toString()))
        reservation.set('ticket_number', ticketNumber)
  
        await reservation.save()
        await session.commitTransaction()
  
        res.status(200).json({Reservation: reservation })
      },transactionOptions);
  }
    catch (e) {
      res.status(400).send({error :true , message: e.message})
    } 
    finally {
      session.endSession()
    }
  }
  
  const cancelReservation = async (req ,res) =>{
      try{
        ObjectId = require('mongodb').ObjectId
        id = new ObjectId(req.body.reservation_id);
        const reservation = await Reservation.findById(id)
        var a = new Date()
        var b = new Date(reservation.createdAt)
        var days = (a - b) / (60 * 60 * 24 * 1000)
        row = reservation.seat_row
        col = reservation.seat_col
        if(days<=3){
            var query={}
            var update={}
            query["_id"]=new ObjectId(reservation.match)
            if(reservation.is_VIP==0){
                normalSeats= `"normal_seats.${row}.${col}"`.toString().slice(1,-1)
                update[normalSeats]=false
            }else{
                vipSeats= `"vip_seats.${row}.${col}"`.toString().slice(1,-1)
                update[vipSeats]=false
            }
            slot = await Match.findOneAndUpdate(query, {$set: update}, { useFindAndModify: false })
            await Reservation.deleteOne({"_id":id})
            res.status(200).send("Successfully deleted")
        }else{
            res.status(400).send('Cant be canceled')
        }
      }catch(e){
        res.status(400).send({error :true , message: e.message})
      }
  }

const getReservations = async (req ,res) =>{
  reservations = await Reservation.find({owner: req.user})
  return res.status(200).json(reservations);
}


module.exports ={
    editUserData,
    getAllMatches,
    bookTicket,
    getReservations,
    cancelReservation
}
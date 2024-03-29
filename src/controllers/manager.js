const User = require('../models/User.js')
const Match = require('../models/Match.js')
const Stadium = require('../models/Stadium.js')
const Reservation = require('../models/Reservation.js')
const mongoose = require('mongoose')

const addMatch =  async (req, res) => {
    try {
        if (!req.user.role)
            throw new Error('User does not have manager credentials');

        const match = new Match(req.body);
        const stadium = await Stadium.findById(match.match_venue)
        
        const normalCol = stadium.seats_per_row
        const vipCol = stadium.VIP_area_seats_per_row
        const normalRow = stadium.normal_area_rows
        const vipRow = stadium.VIP_area_rows
        
        const normalSeats =
        Array.from({ length: normalRow }, () => 
        Array.from({ length: normalCol }, () => false));
        
        const VIPSeats =
        Array.from({ length: vipRow }, () => 
        Array.from({ length: vipCol }, () => false));

        match.set('normal_seats', normalSeats)
        match.set('seats', VIPSeats)

        await match.save();
        res.status(201).json({match : match});
    }
    catch(error) {
        res.status(401).send({message: error.message});
    }
}

const getMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchID);
        if (!match)
            throw new Error('No match was found with this id');
        res.status(200).json({match: match});
    }
    catch(error) {
        res.status(400).send({message: error.message});
    }
}

const editMatch = async (req, res) => {
    console.log(req.body)
    try {
        if (!req.user.role)
            throw new Error('User does not have manager credentials');
        const match = await Match.findById(req.params.matchID);
        if (!match)
            throw new Error('No match was found with this id');
        const updatedMatch = await Match.findOneAndUpdate({_id: req.params.matchID}, req.body, {new: true});
        res.status(200).json({match: updatedMatch}); 
    }
    catch(error) {
        res.status(400).send({message: error.message})
    }
}

const addStadium = async (req, res) => {
    try {
        if (!req.user.role)
            throw new Error('User does not have manager credentials');
        const stadium = new Stadium(req.body);
        await stadium.save();
        res.status(201).json({stadium: stadium}); 
    }
    catch(error) {
        res.status(401).send({message: error.message});
    }
}
const getAllStadium = async (req, res) => {
    try {
        allStadium = await Stadium.find()
        res.status(200).json({stadium: allStadium})
    }catch(error) {
        res.status(400).send({message: error.message});
    }
}

const getSeats = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchID);
        if (!match)
            throw new Error('No match was found with this id');
        res.status(200).json({normalSeats: match.normalSeats, VIPSeats: match.VIPSeats}); 
    }
    catch(error) {
        res.status(400).send({message: error.message})
    }
}

module.exports = {
    addMatch,
    getMatch,
    editMatch,
    addStadium,
    getSeats,
    getAllStadium
}

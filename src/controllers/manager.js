const User = require('../models/User.js')
const Match = require('../models/Match.js')
const Stadium = require('../models/Stadium.js')
const Reservation = require('../models/Reservation.js')

const addMatch =  async (req, res) => {
    try {
        const match = new Match(req.body);
        await match.save();
        res.status(201).json({match : match}); 
    }
    catch(error) {
        res.status(400).send({message : error.message});
    }
}

const getMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match)
            throw new Error('No match was found with this id');
        res.status(201).json({match : match});
    }
    catch(error) {
        res.status(400).send({message : error.message});
    }

}

const editMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match)
            throw new Error('No match was found with this id');
        const updatedMatch = await Match.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});
        res.status(200).json({match: updatedMatch}); 
    }
    catch(error) {
        res.status(400).send({message : error.message})
    }
}

const addStadium = async (req, res) => {
    try {
        const stadium = new Stadium(req.body);
        await stadium.save();
        res.status(201).json({stadium : stadium}); 
    }
    catch(error) {
        res.status(400).send({message : error.message});
    }
}

const getSeats = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchid);
        if (!match)
            throw new Error('No match was found with this id');
        Match
            .findOne({_id : req.params.matchid})
            .populate('reservations')
            .exec(function(error, match){
                if (error) 
                    throw error;
                res.status(201).json({reservations : match.reservations}); 
            });
    }
    catch(error) {
        res.status(400).send({message : error.message})
    }
}

module.exports = {
    addMatch,
    getMatch,
    editMatch,
    addStadium,
    getSeats
}
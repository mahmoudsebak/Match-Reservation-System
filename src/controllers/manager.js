const User = require('../models/User.js')
const Match = require('../models/Match.js')
const Stadium = require('../models/Stadium.js')
const Reservation = require('../models/Reservation.js')
const AppError = require('../app_error')

const addMatch =  async (req, res) => {
    try {
        if (!req.user.role)
            throw new AppError('User does not have manager credentials', 401);
        const match = new Match(req.body);
        await match.save();
        res.status(201).json({match: match}); 
    }
    catch(error) {
        res.status(error.statusCode).send({message: error.message});
    }
}

const getMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchID);
        if (!match)
            throw new AppError('No match was found with this id', 400);
        res.status(200).json({match: match});
    }
    catch(error) {
        res.status(error.statusCode).send({message: error.message});
    }
}

const editMatch = async (req, res) => {
    try {
        if (!req.user.role)
            throw new AppError('User does not have manager credentials', 401);
        const match = await Match.findById(req.params.matchID);
        if (!match)
            throw new AppError('No match was found with this id', 400);
        const updatedMatch = await Match.findOneAndUpdate({_id: req.params.matchID}, req.body, {new: true});
        res.status(200).json({match: updatedMatch}); 
    }
    catch(error) {
        res.status(error.statusCode).send({message: error.message})
    }
}

const addStadium = async (req, res) => {
    try {
        if (!req.user.role)
            throw new AppError('User does not have manager credentials', 401);
        const stadium = new Stadium(req.body);
        await stadium.save();
        res.status(201).json({stadium: stadium}); 
    }
    catch(error) {
        res.status(error.statusCode).send({message: error.message});
    }
}

const getSeats = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchID);
        if (!match)
            throw new AppError('No match was found with this id', 400);
        Match
            .findOne({_id: req.params.matchID})
            .populate('reservations')
            .exec(function(error, match){
                res.status(200).json({reservations: match.reservations}); 
            });
    }
    catch(error) {
        res.status(error.statusCode).send({message: error.message})
    }
}

module.exports = {
    addMatch,
    getMatch,
    editMatch,
    addStadium,
    getSeats
}
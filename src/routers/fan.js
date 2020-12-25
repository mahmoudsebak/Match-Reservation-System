const express = require('express')
const router = new express.Router()
const User = require('../models/User.js')
const Match = require('../models/Match.js')
const Stadium = require('../models/Stadium.js')
const Reservation = require('../models/Reservation.js')
const { findById } = require('../models/User.js')


// Write APIs here ......

module.exports = router
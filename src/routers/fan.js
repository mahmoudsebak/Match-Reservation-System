const express = require('express')
const router = new express.Router()
const fanController = require('../controllers/fan')
const auth = require('../middleware/user_auth')

router.patch('/fans/editdata',auth, fanController.editUserData)
router.post('/fans/getallmatches',auth, fanController.getAllMatches)
router.post('/fans/addreservation',auth, fanController.bookTicket)
router.delete('/fans/cancelreservation',auth,fanController.cancelReservation)

module.exports = router
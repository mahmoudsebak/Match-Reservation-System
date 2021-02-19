const express = require('express')
const router = new express.Router()
const managerController = require('../controllers/manager')
const auth = require('../middleware/user_auth')

router.post('/manager/match', managerController.addMatch);/// care hereeee
router
  .route('/manager/match/:matchID')
  .get(managerController.getMatch)
  .patch(managerController.editMatch);
router.post('/manager/stadium', auth, managerController.addStadium);
router.get('/manager/seats/:matchID', managerController.getSeats);
router.get('/manager/getAllStadium', managerController.getAllStadium);

module.exports = router
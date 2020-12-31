const express = require('express')
const router = new express.Router()
const managerController = require('../controllers/manager')
const auth = require('../middleware/user_auth')

router.post('/manager/match', auth, managerController.addMatch);
router
  .route('/manager/match/:id')
  .get(managerController.getMatch)
  .patch(auth, managerController.editMatch);
router.post('/manager/stadium', auth, managerController.addStadium);
router.get('/manager/seats/:matchid', managerController.getSeats);

module.exports = router
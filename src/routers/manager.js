const express = require('express')
const router = new express.Router()
const managerController = require('../controllers/manager')

router.post('/manager/match', managerController.addMatch);
router
  .route('/manager/match/:id')
  .get(managerController.getMatch)
  .patch(managerController.editMatch);
router.post('/manager/stadium', managerController.addStadium);
router.get('/manager/seats/:matchid', managerController.getSeats);

module.exports = router
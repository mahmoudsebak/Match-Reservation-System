const express = require('express')
const router = new express.Router()
const userController = require('../controllers/user')

router.post('/users/signup', userController.userSignup)
router.post('/users/signin', userController.userSignin)

module.exports = router
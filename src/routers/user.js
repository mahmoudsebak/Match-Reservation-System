const express = require('express')
const router = new express.Router()
const userController = require('../controllers/user')
const auth = require('../middleware/user_auth')

router.get('/users/check', userController.checkUser)
router.post('/users/signup', userController.userSignup)
router.post('/users/signin', userController.userSignin)
router.post('/users/logout', auth, userController.userLogout)

module.exports = router
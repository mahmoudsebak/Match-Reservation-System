const express = require('express')
const router = new express.Router()
const userController = require('../controllers/user')
const auth = require('../middleware/user_auth')
const auth2 = require('../middleware/admin_auth')

router.get('/users/check', userController.checkUser)
router.post('/users/signup', userController.userSignup)
router.post('/users/signin', userController.userSignin)
router.post('/users/logout', auth, userController.userLogout)
router.get('/users', auth2, userController.getUsers)


module.exports = router
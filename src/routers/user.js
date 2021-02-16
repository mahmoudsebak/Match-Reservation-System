const express = require('express')
const router = new express.Router()
const userController = require('../controllers/user')
const auth = require('../middleware/user_auth')

router.post('/users/signup', userController.userSignup)
router.post('/users/signin', userController.userSignin)
router.post('/users/logout', auth, userController.userLogout)
router.get('/users', auth, userController.getUsers)


module.exports = router
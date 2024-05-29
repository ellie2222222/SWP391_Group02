const express = require('express')
const { loginUser, signupUser, deleteUser} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')
const requireAdmin = require('../middleware/requireAdmin')

const userRoutes = express.Router()

userRoutes.post('/login', loginUser)

userRoutes.post('/signup', signupUser)

userRoutes.delete('/delete/:id', requireAuth, requireAdmin, deleteUser);

module.exports = userRoutes
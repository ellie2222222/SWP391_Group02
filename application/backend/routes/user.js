const express = require('express')
const { loginUser, signupUser, logout, refreshToken, forgotPassword, resetPassword } = require('../controllers/userController')


const userRoutes = express.Router()

userRoutes.post('/login', loginUser)

userRoutes.post('/signup', signupUser)

userRoutes.post('/logout', logout)

userRoutes.post('/refresh-token', refreshToken)

userRoutes.post('/forgot-password', forgotPassword);

userRoutes.post('/reset/:id/:token', resetPassword);

module.exports = userRoutes
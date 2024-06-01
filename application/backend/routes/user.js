const express = require('express')
const { loginUser, signupUser, deleteUser, assignRole} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')
const {requireAdmin} = require('../middleware/requireRoles')

const userRoutes = express.Router()

userRoutes.post('/login', loginUser)

userRoutes.post('/signup', signupUser)

userRoutes.patch('/assignRole', requireAdmin, assignRole)

userRoutes.delete('/delete/:id', requireAuth, requireAdmin, deleteUser);

module.exports = userRoutes
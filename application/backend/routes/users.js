const express = require('express')
const { deleteUser, assignRole, getUsers, getUser} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')
const {requireAdmin} = require('../middleware/requireRoles')

const usersRoutes = express.Router()

usersRoutes.use(requireAuth)

usersRoutes.use(requireAdmin)

usersRoutes.patch('/role-assignment/:id', assignRole)

usersRoutes.delete('/:id', deleteUser);

usersRoutes.get('/', getUsers)

usersRoutes.get('/:id', getUser)

module.exports = usersRoutes
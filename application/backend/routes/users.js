const express = require('express')
const { deleteUser, assignRole, getUsers, getUser} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')
const {requireAdmin} = require('../middleware/requireRoles')

const usersRoutes = express.Router()

usersRoutes.use(requireAuth)

usersRoutes.patch('/role-assignment/:id', requireAdmin, assignRole)

usersRoutes.delete('/:id', requireAdmin, deleteUser);

usersRoutes.get('/', requireAdmin, getUsers)

usersRoutes.get('/:id', getUser)

module.exports = usersRoutes
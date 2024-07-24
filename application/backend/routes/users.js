const express = require('express')
const { updateUser, deleteUser, assignRole, getUsers, getUser, getStaffContact} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')
const {requireAdmin} = require('../middleware/requireRoles')

const usersRoutes = express.Router()

usersRoutes.use(requireAuth)

usersRoutes.get('/get-staff-contact', getStaffContact)

usersRoutes.patch('/role-assignment/:id', requireAdmin, assignRole)

usersRoutes.patch('/:id', updateUser)

usersRoutes.delete('/:id', requireAdmin, deleteUser);

usersRoutes.get('/', requireAdmin, getUsers)

usersRoutes.get('/:id', getUser)


// To get all users: GET /users
// To get users filtered by username (case-insensitive): GET /users?username=john
// To get users sorted by username in ascending order: GET /users?sort=username_asc
// To get users sorted by username in descending order: GET /users?sort=username_desc
// To get users sorted by email in ascending order: GET /users?sort=email_asc
// To get users sorted by email in descending order: GET /users?sort=email_desc
// To get users filtered by username and sorted by email in ascending order: GET /users?username=john&sort=email_asc
module.exports = usersRoutes
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getRequests, createRequest, getStaffRequests, getMyRequests, updateRequest } = require('../controllers/requestController')
const { requireUser, requireAdmin, requireManager, requireManagerOrStaff } = require('../middleware/requireRoles')

const requestRoutes = express.Router()

requestRoutes.use(requireAuth)

requestRoutes.post('/createRequest', requireUser, createRequest)

// Get all requests from one user
requestRoutes.get('/getMyRequests', requireUser, getMyRequests)

// Get all requests one staff works on
requestRoutes.get('/getStaffRequests', requireManagerOrStaff, getStaffRequests)

requestRoutes.patch('/updateRequestStatus/:id', requireManager, updateRequest)

module.exports = requestRoutes
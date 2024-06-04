const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getRequests, getRequest, createRequest, getUserRequests, getStaffRequests, getMyRequests } = require('../controllers/requestController')
const { requireUser, requireAdmin, requireManager, requireManagerOrStaff } = require('../middleware/requireRoles')

const requestRoutes = express.Router()

requestRoutes.use(requireAuth)

requestRoutes.post('/createRequest', requireUser, createRequest)

// Get all requests from all user
requestRoutes.get('/getRequests', requireManager, getRequests)

// Get one request
requestRoutes.get('/getRequest/:id', requireManager, getRequest)

// Get all requests from one user 
requestRoutes.get('/getUserRequests/:id', requireManager, getUserRequests)

// Get all requests from one user
requestRoutes.get('/getMyRequests', requireUser, getMyRequests)

// Get all requests one staff works ons
requestRoutes.get('/getStaffRequests', requireManagerOrStaff, getStaffRequests)

module.exports = requestRoutes
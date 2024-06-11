const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getRequests, createRequest, getStaffRequests, getUserRequests, updateRequest, getRequest, getUserRequest, getStaffRequest } = require('../controllers/requestController')
const { requireUser, requireAdmin, requireManager, requireManagerOrStaff, requireManagerOrSale } = require('../middleware/requireRoles')

const requestRoutes = express.Router()

requestRoutes.use(requireAuth)

requestRoutes.post('/', requireUser, createRequest)

requestRoutes.get('/', requireManagerOrSale, getRequests)

// Get all requests from one user
requestRoutes.get('/user-requests', requireUser, getUserRequests)

requestRoutes.get('/user-requests/:id', requireUser, getUserRequest)

// Get all requests from one staff (or manager) works on
requestRoutes.get('/staff-requests', requireManagerOrStaff, getStaffRequests)

requestRoutes.get('/staff-requests/:id', requireManagerOrStaff, getStaffRequest)

requestRoutes.get('/:id', requireManagerOrSale, getRequest)

requestRoutes.patch('/:id', requireManagerOrStaff, updateRequest)

module.exports = requestRoutes
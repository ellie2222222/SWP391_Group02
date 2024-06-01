const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getRequests, getRequest, createRequest, getUserRequests } = require('../controllers/requestController')
const { requireUser, requireAdmin, requireManager } = require('../middleware/requireRoles')

const requestRoutes = express.Router()

requestRoutes.use(requireAuth)

requestRoutes.post('/createRequest', requireUser, createRequest)

requestRoutes.get('/getRequests', requireManager, getRequests)

requestRoutes.get('/getRequest/:id', requireManager, getRequest)

requestRoutes.get('/getUserRequests', requireUser, getUserRequests)

module.exports = requestRoutes
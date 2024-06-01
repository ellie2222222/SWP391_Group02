const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getRequests, getRequest, createRequest, getMyRequest } = require('../controllers/requestController')
const { requireUser, requireAdmin, requireManager } = require('../middleware/requireRoles')

const requestRoutes = express.Router()

requestRoutes.use(requireAuth)

requestRoutes.post('/createRequest', requireUser, createRequest)

requestRoutes.get('/getRequests', requireManager, getRequests)

requestRoutes.get('/getRequest/:id', requireManager, getRequest)

requestRoutes.get('/getMyRequests', requireUser, getMyRequest)

module.exports = requestRoutes
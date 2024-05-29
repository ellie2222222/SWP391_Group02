const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getRequests, getRequest, createRequest } = require('../controllers/requestController')

const requestRoutes = express.Router()

requestRoutes.use(requireAuth)

requestRoutes.post('/createRequest', createRequest)

requestRoutes.get('/getRequests', getRequests)

requestRoutes.get('/getRequest/:id', getRequest)

module.exports = requestRoutes
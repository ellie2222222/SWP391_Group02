const express = require('express')
const requireAuth = require('../middleware/requireAuth')

const productionRoutes = express.Router()

productionRoutes.use(requireAuth)

// productionRoutes.post('/createProduction',  createProduction)

// productionRoutes.get('/getProductions', getProductions)

// productionRoutes.get('/getProduction/:id', getProduction)

// productionRoutes.patch('/updateProduction/:id', updateProduction)

module.exports = productionRoutes
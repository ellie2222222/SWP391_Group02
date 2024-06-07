const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { createProduction, getProductions, getProduction, updateProduction, updateProductionStatus } = require('../controllers/productionController')
const { requireProductions, requireManager, requireManagerOrProduction } = require('../middleware/requireRoles')

const productionRoutes = express.Router()

productionRoutes.use(requireAuth)

productionRoutes.post('/createProduction', requireProductions, createProduction)

productionRoutes.get('/getProductions', requireManager ,getProductions)

productionRoutes.get('/getProduction/:id', requireManagerOrProduction, getProduction)

productionRoutes.patch('/updateProduction/:id', requireManagerOrProduction, updateProduction)

productionRoutes.patch('/updateProductionStatus/:id', requireManager, updateProductionStatus)

module.exports = productionRoutes
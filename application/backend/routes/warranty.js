const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getWarranties, getWarranty, createWarranty, updateWarranty } = require('../controllers/warrantyController')
const { requireSales, requireAdmin, requireManager, requireManagerOrSale } = require('../middleware/requireRoles')

const warrantyRoutes = express.Router()

warrantyRoutes.use(requireAuth)

warrantyRoutes.post('/createWarranty', createWarranty)

warrantyRoutes.get('/getWarranties', requireManagerOrSale, getWarranties)

warrantyRoutes.get('/getWarranty/:id', requireManagerOrSale, getWarranty)

warrantyRoutes.patch('/updateWarranty/:id',  requireManagerOrSale, updateWarranty)

module.exports = warrantyRoutes
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getWarranties, getWarranty, createWarranty, updateWarranty, deleteWarranty } = require('../controllers/warrantyController')
const { requireSales, requireAdmin, requireManager, requireManagerOrSale } = require('../middleware/requireRoles')

const warrantyRoutes = express.Router()

warrantyRoutes.use(requireAuth)

warrantyRoutes.post('/createWarranty', requireSales, createWarranty)

warrantyRoutes.get('/getWarranties', requireManagerOrSale, getWarranties)

warrantyRoutes.get('/getWarranty/:id', requireManagerOrSale, getWarranty)

warrantyRoutes.delete('/deleteWarranty/:id', requireManager, deleteWarranty)

warrantyRoutes.patch('/updateWarranty/:id',  requireManagerOrSale, updateWarranty)

module.exports = warrantyRoutes
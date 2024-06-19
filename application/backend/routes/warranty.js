const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getWarranties, getWarranty, createWarranty, updateWarranty, deleteWarranty } = require('../controllers/warrantyController')
const { requireSales, requireAdmin, requireManager, requireManagerOrSale, requireUserOrManagerOrSale } = require('../middleware/requireRoles')

const warrantyRoutes = express.Router()

warrantyRoutes.use(requireAuth)

warrantyRoutes.post('/', requireSales, createWarranty)

warrantyRoutes.get('/', requireManagerOrSale, getWarranties)

warrantyRoutes.get('/:id', requireUserOrManagerOrSale, getWarranty)

warrantyRoutes.delete('/:id', requireManager, deleteWarranty)

warrantyRoutes.patch('/:id',  requireManagerOrSale, updateWarranty)

module.exports = warrantyRoutes
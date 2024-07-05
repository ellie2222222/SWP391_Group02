const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireAdminOrManagerOrSale } = require('../middleware/requireRoles')
const { getMaterials, getMaterial, createMaterial, deleteMaterial, updateMaterial } = require('../controllers/materialController')

const materialRoutes = express.Router()

materialRoutes.get('/', getMaterials)

materialRoutes.get('/:id', getMaterial)

materialRoutes.post('/', requireAuth, requireAdminOrManagerOrSale, createMaterial)

materialRoutes.delete('/:id', requireAuth, requireAdminOrManagerOrSale, deleteMaterial)

materialRoutes.patch('/:id', requireAuth, requireAdminOrManagerOrSale, updateMaterial)

module.exports = materialRoutes
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireAdminOrManagerOrSale } = require('../middleware/requireRoles')
const { getMaterials, getMaterial, createMaterial, deleteMaterial, updateMaterial } = require('../controllers/materialController')
const { redisCacheMiddleware, invalidateCachedData } = require('../middleware/redis');

const materialRoutes = express.Router()

materialRoutes.get('/', redisCacheMiddleware(), getMaterials)

materialRoutes.get('/:id', redisCacheMiddleware(), getMaterial)

materialRoutes.post('/', requireAuth, requireAdminOrManagerOrSale, invalidateCachedData, createMaterial)

materialRoutes.delete('/:id', requireAuth, requireAdminOrManagerOrSale, deleteMaterial)

materialRoutes.patch('/:id', requireAuth, requireAdminOrManagerOrSale, updateMaterial)

module.exports = materialRoutes
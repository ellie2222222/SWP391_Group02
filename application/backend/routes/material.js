const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireAdmin } = require('../middleware/requireRoles')
const { getMaterials, getMaterial, createMaterial, deleteMaterial, updateMaterial } = require('../controllers/materialController')

const materialRoutes = express.Router()

materialRoutes.get('/', getMaterials)

materialRoutes.get('/:id', getMaterial)

materialRoutes.post('/', requireAuth, requireAdmin, createMaterial)

materialRoutes.delete('/:id', requireAuth, requireAdmin, deleteMaterial)

materialRoutes.patch('/:id', requireAuth, requireAdmin, updateMaterial)

module.exports = materialRoutes
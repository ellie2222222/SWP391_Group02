const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireAdmin } = require('../middleware/requireRoles')
const { getMaterials, getMaterial, createMaterial, deleteMaterial, updateMaterial } = require('../controllers/materialController')

const materialRoutes = express.Router()

materialRoutes.get('/getMaterials', getMaterials)

materialRoutes.get('/getMaterial/:id', getMaterial)

materialRoutes.post('/createMaterial', requireAuth, requireAdmin, createMaterial)

materialRoutes.delete('/deleteMaterial/:id', requireAuth, requireAdmin, deleteMaterial)

materialRoutes.patch('/updateMaterial/:id', requireAuth, requireAdmin, updateMaterial)

module.exports = materialRoutes
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireAdmin } = require('../middleware/requireRoles')
const { getGemstones, getGemstone, createGemstone, deleteGemstone, updateGemstone } = require('../controllers/gemstoneController')

const gemstoneRoutes = express.Router()

gemstoneRoutes.get('/', getGemstones)

gemstoneRoutes.get('/:id', getGemstone)

gemstoneRoutes.post('/', requireAuth, requireAdmin, createGemstone)

gemstoneRoutes.delete('/:id', requireAuth, requireAdmin, deleteGemstone)

gemstoneRoutes.patch('/:id', requireAuth, requireAdmin, updateGemstone)

module.exports = gemstoneRoutes
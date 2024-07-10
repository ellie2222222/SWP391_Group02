const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireAdminOrManagerOrSale } = require('../middleware/requireRoles')
const { getGemstones, getGemstone, createGemstone, deleteGemstone, updateGemstone } = require('../controllers/gemstoneController')

const gemstoneRoutes = express.Router()

gemstoneRoutes.get('/', getGemstones)

gemstoneRoutes.get('/:id', getGemstone)

gemstoneRoutes.post('/', requireAuth, requireAdminOrManagerOrSale, createGemstone)

gemstoneRoutes.delete('/:id', requireAuth, requireAdminOrManagerOrSale, deleteGemstone)

gemstoneRoutes.patch('/:id', requireAuth, requireAdminOrManagerOrSale, updateGemstone)

module.exports = gemstoneRoutes
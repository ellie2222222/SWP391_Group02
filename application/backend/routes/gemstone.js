const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireAdmin } = require('../middleware/requireRoles')
const { getGemstones, getGemstone, createGemstone, deleteGemstone, updateGemstone, updateGemstonePrice } = require('../controllers/gemstoneController')

const gemstoneRoutes = express.Router()

gemstoneRoutes.get('/getGemstones', getGemstones)

gemstoneRoutes.get('/getGemstone/:id', getGemstone)

gemstoneRoutes.post('/createGemstone', requireAuth, requireAdmin, createGemstone)

gemstoneRoutes.delete('/deleteGemstone/:id', requireAuth, requireAdmin, deleteGemstone)

gemstoneRoutes.patch('/updateGemstone/:id', requireAuth, requireAdmin, updateGemstone)

gemstoneRoutes.patch('/updateGemstonePrice/:id', requireAuth, requireAdmin, updateGemstonePrice)

module.exports = gemstoneRoutes
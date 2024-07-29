const express = require('express')
const multer = require('multer')
const requireAuth = require('../middleware/requireAuth')
const { requireAdminOrManagerOrSale } = require('../middleware/requireRoles')
const { getGemstones, getGemstone, createGemstone, deleteGemstone, updateGemstone } = require('../controllers/gemstoneController')

const gemstoneRoutes = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage });

gemstoneRoutes.get('/', getGemstones)

gemstoneRoutes.get('/:id', getGemstone)

gemstoneRoutes.post('/', requireAuth, requireAdminOrManagerOrSale, upload.single('file'), createGemstone)

gemstoneRoutes.delete('/:id', requireAuth, requireAdminOrManagerOrSale, deleteGemstone)

gemstoneRoutes.patch('/:id', requireAuth, requireAdminOrManagerOrSale, upload.single('file'), updateGemstone)

module.exports = gemstoneRoutes
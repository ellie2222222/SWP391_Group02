const express = require('express')
const { getJewelries, getJewelry, createJewelry, deleteJewelry, updateJewelry } = require('../controllers/jewelryController')
const requireAuth = require('../middleware/requireAuth')
const {requireAdmin} = require('../middleware/requireRoles')

const jewelryRoutes = express.Router()

jewelryRoutes.get('/', getJewelries)

jewelryRoutes.get('/:id', getJewelry)

jewelryRoutes.post('/', requireAuth, requireAdmin, createJewelry)

jewelryRoutes.delete('/:id', requireAuth, requireAdmin, deleteJewelry)

jewelryRoutes.patch('/:id', requireAuth, requireAdmin, updateJewelry)

module.exports = jewelryRoutes
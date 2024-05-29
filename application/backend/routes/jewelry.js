const express = require('express')
const { getJewelries, getJewelry, createJewelry, deleteJewelry, updateJewelry } = require('../controllers/jewelryController')
const requireAuth = require('../middleware/requireAuth')
const requireAdmin = require('../middleware/requireAdmin')

const jewelryRoutes = express.Router()

jewelryRoutes.get('/getJewelries', getJewelries)

jewelryRoutes.get('/getJewelry/:id', getJewelry)

jewelryRoutes.post('/createJewelry', requireAuth, requireAdmin, createJewelry)

jewelryRoutes.delete('/deleteJewelry/:id', requireAuth, requireAdmin, deleteJewelry)

jewelryRoutes.patch('/updateJewelry/:id', requireAuth, requireAdmin, updateJewelry)

module.exports = jewelryRoutes
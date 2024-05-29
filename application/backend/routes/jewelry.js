const express = require('express')
const { getJewelries, getJewelry, createJewelry, deleteJewelry, updateJewelry } = require('../controllers/jewelryController')
const requireAuth = require('../middleware/requireAuth')

const jewelryRoutes = express.Router()

jewelryRoutes.get('/getJewelries', getJewelries)

jewelryRoutes.get('/getJewelry/:id', getJewelry)

jewelryRoutes.post('/createJewelry', requireAuth, createJewelry)

jewelryRoutes.delete('/deleteJewelry/:id', requireAuth, deleteJewelry)

jewelryRoutes.patch('/updateJewelry/:id', requireAuth, updateJewelry)

module.exports = jewelryRoutes
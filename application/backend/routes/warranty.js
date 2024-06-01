const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getWarranties, getWarranty, createWarranty } = require('../controllers/warrantyController')

const WarrantyRoutes = express.Router()

WarrantyRoutes.use(requireAuth)

WarrantyRoutes.post('/createWarranty', createWarranty)

WarrantyRoutes.get('/getWarrantys', getWarranties)

WarrantyRoutes.get('/getWarranty/:id', getWarranty)

module.exports = WarrantyRoutes
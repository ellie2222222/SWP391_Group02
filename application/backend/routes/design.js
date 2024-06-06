const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireManagerOrDesign, requireManager, requireDesigns } = require('../middleware/requireRoles')
const { getDesigns, getDesign, createDesign, updateDesign } = require('../controllers/designController')


const designRoutes = express.Router()

designRoutes.use(requireAuth)

designRoutes.get('/getDesigns', requireManager,  getDesigns)

designRoutes.get('/getDesign/:id', requireManagerOrDesign, getDesign)

designRoutes.post('/createDesign', requireDesigns, createDesign)

designRoutes.patch('/updateDesign/:id', requireDesigns, updateDesign)

module.exports = designRoutes
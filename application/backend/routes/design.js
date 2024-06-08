const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireManagerOrDesign, requireManager, requireDesigns } = require('../middleware/requireRoles')
const { getDesigns, getDesign, createDesign, updateDesign, deleteDesign } = require('../controllers/designController')


const designRoutes = express.Router()

designRoutes.use(requireAuth)

designRoutes.get('/', requireManager, getDesigns)

designRoutes.get('/:id', requireManagerOrDesign, getDesign)

designRoutes.post('/', requireDesigns, createDesign)

designRoutes.patch('/:id', requireDesigns, updateDesign)

designRoutes.delete('/:id', requireDesigns, deleteDesign)

module.exports = designRoutes
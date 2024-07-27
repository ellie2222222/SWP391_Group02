const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireManager } = require('../middleware/requireRoles')
const { getWorksOnById, getAllWorksOns, deleteWorksOnById, assignStaffToRequest, removeStaffFromRequest, getWorksOnByRequestId} = require('../controllers/worksOnController.js');

const worksOnRoutes = express.Router()

worksOnRoutes.use(requireAuth)

// worksOnRoutes.post('/', requireManagerOrStaff, createWorksOn)

worksOnRoutes.get('/:id', requireManager, getWorksOnById)

worksOnRoutes.get('/', requireManager, getAllWorksOns)

// worksOnRoutes.patch('/:id', requireManager, updateWorksOnById)

worksOnRoutes.delete('/:id', requireManager, deleteWorksOnById)

worksOnRoutes.get('/request-works-on/:id', requireManager, getWorksOnByRequestId);

worksOnRoutes.patch('/assign-staff/:id', requireManager, assignStaffToRequest);

worksOnRoutes.patch('/remove-staff/:id', requireManager, removeStaffFromRequest);

module.exports = worksOnRoutes;

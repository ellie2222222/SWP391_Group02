const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireManager } = require('../middleware/requireRoles')
const { createWorksOn, getWorksOnById, getAllWorksOns, updateWorksOnById, deleteWorksOnById, addStaffToWorksOn, removeStaffFromWorksOn} = require('../controllers/worksOnController.js');

const worksOnRoutes = express.Router()

worksOnRoutes.post('/', requireAuth, requireManager, createWorksOn)

worksOnRoutes.get('/:id', requireAuth, requireManager, getWorksOnById)

worksOnRoutes.get('/', requireAuth, requireManager, getAllWorksOns)

worksOnRoutes.patch('/:id', requireAuth, requireManager, updateWorksOnById)

worksOnRoutes.delete('/:id', requireAuth, requireManager, deleteWorksOnById)

worksOnRoutes.patch('/:id/add-staff/:staff_id', requireAuth, requireManager, addStaffToWorksOn);

worksOnRoutes.patch('/:id/remove-staff/:staff_id', requireAuth, requireManager, removeStaffFromWorksOn);

module.exports = worksOnRoutes;

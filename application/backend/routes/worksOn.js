const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireManager, requireManagerOrSale, requireManagerOrStaff } = require('../middleware/requireRoles')
const { createWorksOn, getWorksOnById, getAllWorksOns, updateWorksOnById, deleteWorksOnById, addStaffToWorksOn, removeStaffFromWorksOn} = require('../controllers/worksOnController.js');

const worksOnRoutes = express.Router()

worksOnRoutes.use(requireAuth)

worksOnRoutes.post('/', requireManagerOrStaff, createWorksOn)

worksOnRoutes.get('/:id', requireManager, getWorksOnById)

worksOnRoutes.get('/', requireManager, getAllWorksOns)

worksOnRoutes.patch('/:id', requireManager, updateWorksOnById)

worksOnRoutes.delete('/:id', requireManager, deleteWorksOnById)

worksOnRoutes.patch('/:id/add-staff/:staff_id', requireManager, addStaffToWorksOn);

worksOnRoutes.patch('/:id/remove-staff/:staff_id', requireManager, removeStaffFromWorksOn);

module.exports = worksOnRoutes;

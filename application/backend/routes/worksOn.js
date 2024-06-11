const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireManager } = require('../middleware/requireRoles')
const { createWorksOn, getWorksOnById, getAllWorksOns, updateWorksOnById, deleteWorksOnById, addStaffToWorksOn, removeStaffFromWorksOn} = require('../controllers/worksOnController.js');

const worksOnRoutes = express.Router()

worksOnRoutes.use(requireAuth)

worksOnRoutes.use(requireManager)

worksOnRoutes.post('/', createWorksOn)

worksOnRoutes.get('/:id', getWorksOnById)

worksOnRoutes.get('/', getAllWorksOns)

worksOnRoutes.patch('/:id', updateWorksOnById)

worksOnRoutes.delete('/:id', deleteWorksOnById)

worksOnRoutes.patch('/:id/add-staff/:staff_id', addStaffToWorksOn);

worksOnRoutes.patch('/:id/remove-staff/:staff_id', removeStaffFromWorksOn);

module.exports = worksOnRoutes;

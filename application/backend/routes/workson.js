const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireManager } = require('../middleware/requireRoles')
const { createWorksOn, getWorksOnById, getAllWorksOns, updateWorksOnById, deleteWorksOnById, addStaffToWorksOn, removeStaffFromWorksOn} = require('../controllers/worksOnController');

const worksOnRoutes = express.Router()

worksOnRoutes.post('/createWorksOn', requireAuth, requireManager, createWorksOn)

worksOnRoutes.get('/getWorksOnById/:id', requireAuth, requireManager, getWorksOnById)

worksOnRoutes.get('/getAllWorksOns', requireAuth, requireManager, getAllWorksOns)

worksOnRoutes.patch('/updateWorksOnById/:id', requireAuth, requireManager, updateWorksOnById)

worksOnRoutes.delete('/deleteWorksOnById/:id', requireAuth, requireManager, deleteWorksOnById)

worksOnRoutes.patch('/:id/add-staff/:staff_id', requireAuth, requireManager, addStaffToWorksOn);

worksOnRoutes.patch('/:id/remove-staff/:staff_id', requireAuth, requireManager, removeStaffFromWorksOn);

module.exports = worksOnRoutes;
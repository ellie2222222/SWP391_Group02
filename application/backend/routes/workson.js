const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireManager } = require('../middleware/requireRoles')
const { createWorkson, getWorksonById, getAllWorksons, updateWorksonById, deleteWorksonById, addStaffToWorkson, removeStaffFromWorkson} = require('../controllers/worksonController');

const worksonRoutes = express.Router()

worksonRoutes.post('/createWorkson', requireAuth, requireManager, createWorkson)

worksonRoutes.get('/getWorksonById/:id', requireAuth, requireManager, getWorksonById)

worksonRoutes.get('/getAllWorksons', requireAuth, requireManager, getAllWorksons)

worksonRoutes.patch('/updateWorksonById/:id', requireAuth, requireManager, updateWorksonById)

worksonRoutes.delete('/deleteWorksonById/:id', requireAuth, requireManager, deleteWorksonById)

worksonRoutes.patch('/:id/add-staff/:staff_id', requireAuth, requireManager, addStaffToWorkson);

worksonRoutes.patch('/:id/remove-staff/:staff_id', requireAuth, requireManager, removeStaffFromWorkson);

module.exports = worksonRoutes;
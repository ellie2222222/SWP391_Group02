const express = require('express')
const multer = require('multer');
const requireAuth = require('../middleware/requireAuth')
const { getRequests, createRequest, getStaffRequests, getUserRequests, updateRequest, getRequest, getUserRequest, getStaffRequest, createOrderRequest } = require('../controllers/requestController')
const { requireUser, requireManagerOrStaff, requireManagerOrSale } = require('../middleware/requireRoles')


// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const requestRoutes = express.Router()

requestRoutes.use(requireAuth)

requestRoutes.post('/', requireUser, createRequest)

requestRoutes.post('/order-requests', requireUser, createOrderRequest)

requestRoutes.get('/', requireManagerOrStaff, getRequests)

// Get all requests from one user
requestRoutes.get('/user-requests', requireUser, getUserRequests)

requestRoutes.get('/user-requests/:id', requireUser, getUserRequest)

// Get all requests from one staff (or manager) works on
requestRoutes.get('/staff-requests', requireManagerOrStaff, getStaffRequests)

requestRoutes.get('/staff-requests/:id', requireManagerOrStaff, getStaffRequest)

requestRoutes.get('/:id', requireManagerOrSale, getRequest)

requestRoutes.patch('/:id', requireManagerOrStaff, upload.array('design_images', 5), updateRequest)

module.exports = requestRoutes
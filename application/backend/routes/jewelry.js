const express = require('express');
const multer = require('multer');
const { getJewelries, getJewelry, createJewelry, deleteJewelry, updateJewelry } = require('../controllers/jewelryController');
const requireAuth = require('../middleware/requireAuth');
const { requireAdmin } = require('../middleware/requireRoles');
const jewelryRoutes = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
jewelryRoutes.get('/', getJewelries);

jewelryRoutes.get('/:id', getJewelry);

jewelryRoutes.post('/', requireAuth, requireAdmin, upload.single('image'), createJewelry); // Handle single file upload with field name 'image'

jewelryRoutes.delete('/:id', requireAuth, requireAdmin, deleteJewelry);

jewelryRoutes.patch('/:id', requireAuth, requireAdmin, upload.single('image'), updateJewelry); // Handle single file upload with field name 'image'

// GET /api/jewelries?sortByName=asc
// GET /api/jewelries?sortByName=desc
module.exports = jewelryRoutes;
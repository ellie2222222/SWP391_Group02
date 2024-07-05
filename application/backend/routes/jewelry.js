const express = require('express');
const multer = require('multer');
const { getJewelries, getJewelry, createJewelry, deleteJewelry, updateJewelry } = require('../controllers/jewelryController');
const requireAuth = require('../middleware/requireAuth');
const { requireManagerOrSale } = require('../middleware/requireRoles');
const jewelryRoutes = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
jewelryRoutes.get('/', getJewelries);

jewelryRoutes.get('/:id', getJewelry);

jewelryRoutes.post('/', requireAuth, requireManagerOrSale, upload.array('images', 5), createJewelry); // Handle multiple file uploads with field name 'images' and max 5 files

jewelryRoutes.delete('/:id', requireAuth, requireManagerOrSale, deleteJewelry);

jewelryRoutes.patch('/:id', requireAuth, requireManagerOrSale, upload.array('images', 5), updateJewelry); // Handle multiple file uploads with field name 'images' and max 5 files

// GET /api/jewelries?sortByName=asc
// GET /api/jewelries?sortByName=desc
module.exports = jewelryRoutes;

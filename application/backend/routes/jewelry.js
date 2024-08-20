const express = require('express');
const multer = require('multer');
const { getJewelries, getJewelry, createJewelry, deleteJewelry, updateJewelry, updateJewelryAvailability } = require('../controllers/jewelryController');
const requireAuth = require('../middleware/requireAuth');
const { requireAdminOrManagerOrSaleOrDesign,requireAdminOrManagerOrSaleOrDesignOrUser } = require('../middleware/requireRoles');
const { redisCacheMiddleware } = require('../middleware/redis');
const jewelryRoutes = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
jewelryRoutes.get('/', redisCacheMiddleware(), getJewelries);

jewelryRoutes.get('/:id', redisCacheMiddleware(), getJewelry);

jewelryRoutes.post('/', requireAuth, requireAdminOrManagerOrSaleOrDesignOrUser, upload.array('images', 5), createJewelry); // Handle multiple file uploads with field name 'images' and max 5 files

jewelryRoutes.delete('/:id', requireAuth, requireAdminOrManagerOrSaleOrDesign, deleteJewelry);

jewelryRoutes.patch('/:id', requireAuth, requireAdminOrManagerOrSaleOrDesignOrUser, upload.array('images', 5), updateJewelry);

jewelryRoutes.patch('/:id/availability', requireAuth, requireAdminOrManagerOrSaleOrDesignOrUser, updateJewelryAvailability);

module.exports = jewelryRoutes;

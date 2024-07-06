const express = require('express');
const multer = require('multer');
const { getBlogs, getBlog, createBlog, deleteBlog, updateBlog } = require('../controllers/blogController');
const requireAuth = require('../middleware/requireAuth');
const { requireAdminOrManagerOrSale } = require('../middleware/requireRoles');
const blogRoutes = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
blogRoutes.get('/', getBlogs);

blogRoutes.get('/:id', getBlog);

// POST route for creating a blog with multer handling blog_images
blogRoutes.post('/', requireAuth, requireAdminOrManagerOrSale, upload.array('blog_images', 5), createBlog);

// DELETE route for deleting a blog
blogRoutes.delete('/:id', requireAuth, requireAdminOrManagerOrSale, deleteBlog);

// PATCH route for updating a blog with multer handling blog_images
blogRoutes.patch('/:id', requireAuth, requireAdminOrManagerOrSale, upload.array('blog_images', 5), updateBlog);

module.exports = blogRoutes;

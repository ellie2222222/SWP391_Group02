const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { getBlogs, getBlog, getBlogTitle, createBlog, deleteBlog, updateBlog } = require('../controllers/blogController');
const { requireUser, requireAdmin } = require('../middleware/requireRoles');

const blogRoutes = express.Router();

// Create a blog
blogRoutes.post('/', requireAuth, requireAdmin, createBlog);

// Get all blogs or by title
blogRoutes.get('/', getBlogs);

// Get a single blog by ID
blogRoutes.get('/:id', getBlog);

// Update a blog
blogRoutes.patch('/:id', requireAuth, requireAdmin, updateBlog);

// Delete a blog
blogRoutes.delete('/:id', requireAuth, requireAdmin, deleteBlog);

module.exports = blogRoutes;
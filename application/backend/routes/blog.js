const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getBlogs, getBlog, createBlog, deleteBlog, updateBlog } = require('../controllers/blogController')
const { requireUser, requireAdmin } = require('../middleware/requireRoles')

const blogRoutes = express.Router()

blogRoutes.post('/createBlog', requireAuth, requireAdmin, createBlog)

blogRoutes.get('/getBlogs', getBlogs)

blogRoutes.get('/getBlog/:id', getBlog)

blogRoutes.patch('/updateBlog/:id', requireAuth, requireAdmin, updateBlog)

blogRoutes.delete('/deleteBlog/:id', requireAuth, requireAdmin, deleteBlog)

module.exports = blogRoutes
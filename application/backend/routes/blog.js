const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getBlogs, getBlog, createBlog, deleteBlog, updateBlog, getMyBlogs } = require('../controllers/blogController')
const { requireUser, requireAdmin } = require('../middleware/requireRoles')

const blogRoutes = express.Router()

blogRoutes.use(requireAuth)

blogRoutes.post('/createBlog', createBlog)

blogRoutes.get('/getBlogs', getBlogs)

blogRoutes.get('/getBlog/:id', requireAdmin, getBlog)

blogRoutes.patch('/updateBlog',  requireUser, updateBlog)

blogRoutes.delete('/deleteBlog',  requireAdmin, deleteBlog)

blogRoutes.get('/getMyBlogs', requireUser, getMyBlogs)

module.exports = blogRoutess
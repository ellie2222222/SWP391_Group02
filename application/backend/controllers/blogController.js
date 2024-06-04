const Blog = require('../models/blogModel')
const mongoose = require('mongoose')

// get all jewelries
const getBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find({})

      res.status(200).json(blogs)
    } catch (error) {
      res.status(500).json({ error: 'Error while getting blogs' })
    }
}

// get one blog
const getBlog = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'Invalid ID'})
    }
    
    try {
      const blog = await Blog.findById(id)
      
      if (!blog) {
          return res.status(404).json({error: 'No such blog'})
      }
      
      res.status(200).json(blog)
    } catch (error) {
      res.status(500).json({ error: 'Error while getting blog' })
    }
}
  
// create a new blog
const createBlog = async (req, res) => {
    const { blog_title, blog_content } = req.body

    if (!blog_title || !blog_content) {
      return res.status(400).json({error: "Please fill in the required field!"})
    }
    
    try {
      const blog = await Blog.create({ blog_title, blog_content })

      res.status(201).json(blog)
    } catch (error) {
      res.status(500).json({ error: 'Error while creating blog' })
    }
  }

// delete a blog
const deleteBlog = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'Invalid ID'})
    }

    try {
      const blog = await Blog.findOneAndDelete({_id: id})

      if(!blog) {
        return res.status(404).json({error: 'No such blog'})
      }

      res.status(200).json(blog)
    } catch (error) {
      res.status(500).json({ error: 'Error while getting blog' })
    }
}
  
// update a blog
const updateBlog = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid ID'})
    }

    try {
      const blog = await Blog.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true, // Return the updated document
        runValidators: true }
      );

      if (!blog) {
        return res.status(404).json({error: 'No such blog'})
      }

      res.status(200).json(blog)
  } catch (error) {
    res.status(500).json({ error: 'Error while getting blog' })
  }
}

module.exports = { getBlogs, getBlog, createBlog, deleteBlog, updateBlog }
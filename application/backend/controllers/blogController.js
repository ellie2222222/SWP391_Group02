const Blog = require('../models/blogModel')
const mongoose = require('mongoose')

// get all jewelries
const getBlogs = async (req, res) => {
    const blogs = await Blog.find({})

    res.status(200).json(blogs)
}

// get one blog
const getBlog = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid ID'})
      }
    
    const blog = await Blog.findById(id)
    
    if (!blog) {
        return res.status(404).json({error: 'No such blog'})
    }
    
    res.status(200).json(blog)
}

// get my blog
const getMyBlogs = async (req, res) => {
    const { user_id } = req.headers;
  
    const blog = await Blog.find({ user_id: user_id });
  
    if (!blog) {
      return res.status(404).json({ error: "No such blog" });
    }
  
    res.status(200).json(blog);
  };
  
// create a new blog
const createBlog = async (req, res) => {
    const { user_id, blog_content } = req.body
    if (!user_id || !blog_content) {
        return res.status(400).json({error: "Please fill in the required field!"})
      }
    // add to the database
    try {
      const blog = await Blog.create({ user_id, blog_content })
      res.status(200).json(blog)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

// delete a blog
const deleteBlog = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such blog'})
    }

    const blog = await Blog.findOneAndDelete({_id: id})

    if(!blog) {
    return res.status(400).json({error: 'No such blog'})
    }

    res.status(200).json(blog)
}
  
// update a blog
const updateBlog = async (req, res) => {
    const { blog_id, ...updateData } = req.body

    if (!mongoose.Types.ObjectId.isValid(blog_id)) {
        return res.status(400).json({error: 'No such blog'})
    }

    const blog = await Blog.findOneAndUpdate(
      { _id: blog_id },
      { $set: updateData },
      { new: true, // Return the updated document
      runValidators: true } // Return the updated document
  );
    if (!blog) {
    return res.status(400).json({error: 'No such blog'})
    }

    res.status(200).json(blog)
}

module.exports = { getBlogs, getBlog, createBlog, deleteBlog, updateBlog, getMyBlogs }
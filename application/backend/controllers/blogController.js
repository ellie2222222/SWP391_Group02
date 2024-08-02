const Blog = require('../models/blogModel');
const mongoose = require('mongoose');
const streamifier = require('streamifier');
const { cloudinary } = require('../cloudinary');

// Helper functions for validation
const validateEmptyFields = (data) => {
    const { blog_title, blog_content } = data;
    let emptyFields = [];

    if (!blog_title) emptyFields.push('blog_title');
    if (!blog_content) emptyFields.push('blog_content');

    if (emptyFields.length > 0) {
        return "Please fill in the required field";
    }

    return null;
};

const validateInputData = (data) => {
    let validationErrors = [];
    // Add any specific input validation here if needed

    return validationErrors;
};

const createBlog = async (req, res) => {
    try {
        let { blog_title, blog_content } = req.body;

        // Validate Empty Fields
        const emptyFieldsError = validateEmptyFields(req.body);
        if (emptyFieldsError) {
            return res.status(400).json({ error: emptyFieldsError });
        }

        // Validate Input Data
        const validationErrors = validateInputData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ error: validationErrors.join(', ') });
        }

        const blog_images = [];
        const images_public_ids = [];

        // Handle file uploads
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'blogs' }, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            blog_images.push(result.secure_url);
                            images_public_ids.push(result.public_id);
                            resolve();
                        }
                    });
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                });
            });

            await Promise.all(uploadPromises);
        }

        // Create new blog post
        const newBlog = new Blog({
            blog_title,
            blog_content,
            blog_images,
            images_public_ids
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
      let { blog_title, blog_content, imagesToDelete } = req.body;
  
      const validationErrors = validateInputData(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors.join(', ') });
      }
  
      const existingBlog = await Blog.findById(req.params.id);
      if (!existingBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
  
      let updateData = {};
      if (blog_title) updateData.blog_title = blog_title;
      if (blog_content) updateData.blog_content = blog_content;
  
      if (imagesToDelete) {
        imagesToDelete = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
  
        if (imagesToDelete.length > 0) {
          const deletePromises = imagesToDelete.map(publicId => cloudinary.uploader.destroy(publicId));
          await Promise.all(deletePromises);
  
          existingBlog.blog_images = existingBlog.blog_images.filter(img => !imagesToDelete.includes(img));
          existingBlog.images_public_ids = existingBlog.images_public_ids.filter(id => !imagesToDelete.includes(id));
  
          updateData.blog_images = existingBlog.blog_images;
          updateData.images_public_ids = existingBlog.images_public_ids;
        }
      }
  
      if (req.files && req.files.length > 0) {
        const blog_images = [];
        const images_public_ids = [];
        const uploadPromises = req.files.map(file => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ folder: 'blogs' }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                blog_images.push(result.secure_url);
                images_public_ids.push(result.public_id);
                resolve();
              }
            });
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
          });
        });
  
        await Promise.all(uploadPromises);
  
        updateData.blog_images = [...existingBlog.blog_images, ...blog_images];
        updateData.images_public_ids = [...existingBlog.images_public_ids, ...images_public_ids];
      }
  
      await Blog.findByIdAndUpdate(req.params.id, updateData);
  
      return res.json({ message: 'Blog updated successfully' });
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  };

const getBlogs = async (req, res) => {
    const { page = 1, limit = 12, search } = req.query;

    try {
        let query = {};
        if (search) {
            query.blog_title = new RegExp(search, 'i'); // 'i' for case-insensitive search
        }

        const skip = (page - 1) * limit;
        const blogs = await Blog.find(query).skip(skip).limit(parseInt(limit));

        // Count total number of documents
        const total = await Blog.countDocuments(query);

        res.status(200).json({
            blogs,
            total: total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ error: 'Error while getting blogs' });
    }
};

// Get one blog
const getBlog = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ error: 'No such blog' });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a blog
const deleteBlog = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({ error: 'No such blog' });
        }

        // Delete associated images from Cloudinary
        const deletePromises = blog.images_public_ids.map(publicId => cloudinary.uploader.destroy(publicId));
        await Promise.all(deletePromises);

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting blog' });
    }
};

module.exports = {
    getBlogs,
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog
};

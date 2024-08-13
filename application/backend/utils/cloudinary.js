const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier'); // Import streamifier for handling buffers

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary, streamifier };
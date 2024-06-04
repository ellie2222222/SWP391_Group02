const mongoose = require('mongoose')

const Schema = mongoose.Schema

const blogSchema = new Schema( {
    blog_title: {
        type: String,
        required: true
    },
    blog_content: {
        type: String,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Blog', blogSchema)
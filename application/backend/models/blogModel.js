const mongoose = require('mongoose')

const Schema = mongoose.Schema

const blogSchema = new Schema( {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    blog_content: {
        type: String,
        required: true
    },
    
}, {timestamps: true})

module.exports = mongoose.model('Blog', blogSchema)
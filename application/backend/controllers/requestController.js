const Request = require('../models/requestModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

// get all requests
const getRequests = async (req, res) => {
    const request = await Request.find({})

    res.status(200).json(request)
}

// get one request
const getRequest = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such request'})
      }
    
    const request = await Request.findById(id)
    
    if (!request) {
        return res.status(404).json({error: 'No such request'})
    }
    
    res.status(200).json(request)
}

// create a new request
const createRequest = async (req, res) => {
    console.log('start creating request')
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const { _id } = jwt.verify(token, process.env.SECRET);

    const { description } = req.body
  
    if (!description) {
      return res.status(400).json({error: "Please fill in the required field!"})
    }

    // add to the database
    try {
      const request = await Request.create({ user_id: _id, description })
      res.status(200).json(request)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }


module.exports = { getRequests, getRequest, createRequest }
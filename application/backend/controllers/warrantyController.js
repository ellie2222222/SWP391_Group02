const warranty = require('../models/warrantyModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

// get all warranties
const getWarranties = async (req, res) => {
    const warranty = await warranty.find({})

    res.status(200).json(warranty)
}

// get one warranty
const getWarranty = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such warranty'})
      }
    
    const warranty = await warranty.findById(id)
    
    if (!warranty) {
        return res.status(404).json({error: 'No such warranty'})
    }
    
    res.status(200).json(warranty)
}

// create a new warranty
const createWarranty = async (req, res) => {
    const { warranty_content, user_id, jewelry_id } = req.body
  
    if (!warranty_content || !user_id || !jewelry_id) {
      return res.status(400).json({error: "Please fill in the required field!"})
    }

    // add to the database
    try {
      const warranty = await warranty.create({ user_id, jewelry_id, warranty_content })
      res.status(200).json(warranty)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
// delete a warranty
const deleteWarranty = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such warranty'})
    }

    const warranty = await warranty.findOneAndDelete({_id: id})

    if(!warranty) {
    return res.status(400).json({error: 'No such warranty'})
    }

    res.status(200).json(warranty)
}
  
// update a warranty
const updateWarranty = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such warranty'})
    }

    const warranty = await warranty.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!warranty) {
    return res.status(400).json({error: 'No such warranty'})
    }

    res.status(200).json(warranty)
}

module.exports = { getWarranties, getWarranty, createWarranty, deleteWarranty, updateWarranty }
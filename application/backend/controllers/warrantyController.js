const Warranty = require('../models/warrantyModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

// get all warranties
const getWarranties = async (req, res) => {
    const warranty = await Warranty.find({})

    res.status(200).json(warranty)
}

// get one warranty
const getWarranty = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such warranty'})
      }
    
    const warranty = await Warranty.findById(id)
    
    if (!warranty) {
        return res.status(404).json({error: 'No such warranty'})
    }
    
    res.status(200).json(warranty)
}

// create a new warranty
const createWarranty = async (req, res) => {
    const { warranty_content, user_id, jewelry_id, warranty_end_date } = req.body
    wed = new Date(warranty_end_date).toISOString();
  
    if (!warranty_content || !user_id || !jewelry_id) {
      return res.status(400).json({error: "Please fill in the required field!"})
    }

    // add to the database
    try {
      const warranty = await Warranty.create({ user_id, jewelry_id, warranty_content, warranty_end_date: wed })
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

    const warranty = await Warranty.findOneAndDelete({_id: id})

    if(!warranty) {
    return res.status(400).json({error: 'No such warranty'})
    }

    res.status(200).json(warranty)
}
  
// update a warranty
const updateWarranty = async (req, res) => {
    const { warranty_id, ...updateData } = req.body

    if (!mongoose.Types.ObjectId.isValid(warranty_id)) {
        return res.status(400).json({error: 'No such warranty'})
    }

    const warranty = await Warranty.findOneAndUpdate(
      { _id: warranty_id },
      { $set: updateData },
      { new: true } // Return the updated document
  );
    if (!warranty) {
    return res.status(400).json({error: 'No such warranty'})
    }

    res.status(200).json(warranty)
}

module.exports = { getWarranties, getWarranty, createWarranty, deleteWarranty, updateWarranty }
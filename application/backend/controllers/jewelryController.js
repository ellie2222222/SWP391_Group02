const Jewelry = require('../models/jewelryModel')
const mongoose = require('mongoose')

// get all jewelries
const getJewelries = async (req, res) => {
    try {
      const jewelries = await Jewelry.find({})

      res.status(200).json(jewelries)
    } catch (error) {
      res.status(500).json({ error: 'Error while getting jewelries' });
    }
}

// get one jewelry
const getJewelry = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'Invalid ID'})
    }
    
    try {
      const jewelry = await Jewelry.findById(id)
      
      if (!jewelry) {
          return res.status(404).json({error: 'No such jewelry'})
      }
      
      res.status(200).json(jewelry)
    } catch (error) {
      res.status(500).json({ error: 'Error while getting a jewelry' });
    }
}

// create a new jewelry
const createJewelry = async (req, res) => {
    const { name, description, gemstone_id, gemstone_weight, material_id, material_weight, price, category, model_type, images } = req.body
  
    let emptyFields = []
    
    if (!name) {
      emptyFields.push('name')
    }
    if (!description) {
      emptyFields.push('description')
    }
    if (!material_id) {
        emptyFields.push('material')
    }
    if (!material_weight) {
        emptyFields.push('material_weight')
    }
    if (!category) {
        emptyFields.push('category')
    }
    if (!price) {
        emptyFields.push('price')
    }
    if (!model_type) {
        emptyFields.push('model_type')
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({error: "Please fill in the required fields!"})
    }
  
    // add to the database
    try {
      const jewelry = await Jewelry.create({ name, description, gemstone_id, gemstone_weight, material_id, material_weight, price, category, model_type, images })

      res.status(201).json(jewelry)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

// delete a jewelry
const deleteJewelry = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'Invalid ID'})
    }
    try {
      const jewelry = await Jewelry.findOneAndDelete({_id: id})

      if (!jewelry) {
      return res.status(404).json({error: 'No such jewelry'})
      }

      res.status(200).json(jewelry)
    } catch (error) {
      res.status(500).json({ error: 'Error while deleting jewelry' });
    }
}
  
// update a jewelry
const updateJewelry = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid ID'})
    }

    try {
      const jewelry = await Jewelry.findOneAndUpdate(
        {_id: id},
        req.body,
        { new: true, // Return the updated document
        runValidators: true }
      )

      if (!jewelry) {
      return res.status(404).json({error: 'No such jewelry'})
      }

      res.status(200).json(jewelry)
    } catch (error) {
      res.status(500).json({ error: 'Error while updating jewelry' });
    }
}

module.exports = { getJewelries, getJewelry, createJewelry, deleteJewelry, updateJewelry }
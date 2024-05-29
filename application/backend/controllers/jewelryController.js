const Jewelry = require('../models/jewelryModel')
const mongoose = require('mongoose')

// get all jewelries
const getJewelries = async (req, res) => {
    const jewelries = await Jewelry.find({})

    res.status(200).json(jewelries)
}

// get one jewelry
const getJewelry = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such jewelry'})
      }
    
    const jewelry = await Jewelry.findById(id)
    
    if (!jewelry) {
        return res.status(404).json({error: 'No such jewelry'})
    }
    
    res.status(200).json(jewelry)
}

// create a new jewelry
const createJewelry = async (req, res) => {
    const { name, description, gemstone, gemstone_weight, material, material_weight, price, category, model_type } = req.body
  
    let emptyFields = []
    
    if (!name) {
      emptyFields.push('name')
    }
    if (!description) {
      emptyFields.push('description')
    }
    if (!material) {
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
      const jewelry = await Jewelry.create({ name, description, gemstone, gemstone_weight, material, material_weight, price, category, model_type })
      res.status(200).json(jewelry)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

// delete a jewelry
const deleteJewelry = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such jewelry'})
    }

    const jewelry = await Jewelry.findOneAndDelete({_id: id})

    if(!jewelry) {
    return res.status(400).json({error: 'No such jewelry'})
    }

    res.status(200).json(jewelry)
}
  
// update a jewelry
const updateJewelry = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such jewelry'})
    }

    const jewelry = await Jewelry.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!jewelry) {
    return res.status(400).json({error: 'No such jewelry'})
    }

    res.status(200).json(jewelry)
}

module.exports = { getJewelries, getJewelry, createJewelry, deleteJewelry, updateJewelry }
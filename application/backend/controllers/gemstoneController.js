const Gemstone = require('../models/gemstoneModel')
const mongoose = require('mongoose')

// get all jewelries
const getGemstones = async (req, res) => {
    const gemstones = await Gemstone.find({})

    res.status(200).json(gemstones)
}

// get one gemstone
const getGemstone = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid ID'})
      }
    
    const gemstone = await Gemstone.findById(id)
    
    if (!gemstone) {
        return res.status(404).json({error: 'No such gemstone'})
    }
    
    res.status(200).json(gemstone)
}

// create a new gemstone
const createGemstone = async (req, res) => {
    const { name, price, carat, cut, clarity, color } = req.body
  
    let emptyFields = []
    
    if (!name) {
      emptyFields.push('name')
    }
    if (!price) {
      emptyFields.push('price')
    }
    if (!carat) {
        emptyFields.push('carat')
    }
    if (!cut) {
        emptyFields.push('cut')
    }
    if (!clarity) {
        emptyFields.push('clarity')
    }
    if (!color) {
        emptyFields.push('color')
    }

    if (emptyFields.length > 0) {
      return res.status(400).json({error: "Please fill in the required fields!"})
    }
  
    // add to the database
    try {
      const gemstone = await Gemstone.create({ name, price, carat, cut, clarity, color })
      res.status(200).json(gemstone)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

// delete a gemstone
const deleteGemstone = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'Invalid ID'})
    }

    const gemstone = await Gemstone.findOneAndDelete({_id: id})

    if(!gemstone) {
    return res.status(400).json({error: 'No such gemstone'})
    }

    res.status(200).json(gemstone)
}
  
// update a gemstone
const updateGemstone = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid ID'})
    }

    const gemstone = await Gemstone.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!gemstone) {
    return res.status(400).json({error: 'No such gemstone'})
    }

    res.status(200).json(gemstone)
}

module.exports = { getGemstones, getGemstone, createGemstone, deleteGemstone, updateGemstone }
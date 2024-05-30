const Material = require('../models/materialModel')
const mongoose = require('mongoose')

// get all jewelries
const getMaterials = async (req, res) => {
    const materials = await Material.find({})

    res.status(200).json(materials)
}

// get one material
const getMaterial = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such material'})
      }
    
    const material = await Material.findById(id)
    
    if (!material) {
        return res.status(404).json({error: 'No such material'})
    }
    
    res.status(200).json(material)
}

// create a new material
const createMaterial = async (req, res) => {
    const { name, price, carat } = req.body
  
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

    if (emptyFields.length > 0) {
      return res.status(400).json({error: "Please fill in the required fields!"})
    }
  
    // add to the database
    try {
      const material = await Material.create({ name, carat, price })
      res.status(200).json(material)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

// delete a material
const deleteMaterial = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such material'})
    }

    const material = await Material.findOneAndDelete({_id: id})

    if(!material) {
    return res.status(400).json({error: 'No such material'})
    }

    res.status(200).json(material)
}
  
// update a material
const updateMaterial = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such material'})
    }

    const material = await Material.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!material) {
    return res.status(400).json({error: 'No such material'})
    }

    res.status(200).json(material)
}

module.exports = { getMaterials, getMaterial, createMaterial, deleteMaterial, updateMaterial }
const Material = require('../models/materialModel')
const mongoose = require('mongoose')

// get all jewelries
const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find({})

    res.status(200).json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'An error occurred while fetching materials' });
  }
}

// get one material
const getMaterial = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid ID'})
      }
    
      try {
        const material = await Material.findById(id);

        if (!material) {
            return res.status(404).json({ error: 'No such material' });
        }

        res.status(200).json(material);
    } catch (error) {
        console.error('Error fetching material:', error);
        res.status(500).json({ error: 'An error occurred while fetching the material' });
    }
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
    
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    if (typeof carat !== 'number' || carat <= 0) {
        return res.status(400).json({ error: "Carat must be a positive number" });
    }
  
    // add to the database
    try {
      const material = await Material.create({ name, carat, price })

      res.status(201).json(material)
    } catch (error) {
      console.error('Error creating material:', error);
      res.status(500).json({ error: 'An error occurred while creating the material' });
  }
  }

// delete a material
const deleteMaterial = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'Invalid ID'})
    }

    try {
        const material = await Material.findOneAndDelete({ _id: id });

        if (!material) {
            return res.status(404).json({ error: 'No such material' });
        }

        res.status(200).json(material);
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({ error: 'An error occurred while deleting the material' });
    }
}
  
// update a material
const updateMaterial = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid ID'})
    }

    try {
      const material = await Material.findOneAndUpdate(
        { _id: id }, 
        req.body, 
        { new: true, // Return the updated document
        runValidators: true }
      );

      if (!material) {
          return res.status(404).json({ error: 'No such material' });
      }

      res.status(200).json(material);
  } catch (error) {
      console.error('Error updating material:', error);
      res.status(500).json({ error: 'An error occurred while updating the material' });
  }
}

module.exports = { getMaterials, getMaterial, createMaterial, deleteMaterial, updateMaterial }
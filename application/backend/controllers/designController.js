const Design = require('../models/designModel')
const mongoose = require('mongoose')
const Jewelry = require('../models/jewelryModel')

// get all design
const getDesigns = async (req, res) => {
    try {
      const design = await Design.find({})

      res.status(200).json(blogs)
    } catch (error) {
      res.status(500).json({ error: 'Error while getting designs' })
    }
}

// get one blog
const getDesign = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'Invalid ID'})
    }
    
    try {
      const design = await Design.findById(id)
      
      if (!design) {
          return res.status(404).json({error: 'No such design'})
      }
      
      res.status(200).json(design)
    } catch (error) {
      res.status(500).json({ error: 'Error while getting design' })
    }
}
  
// create a new design
const createDesign = async (req, res) => {
    const { design_name, jewelry_id, images } = req.body

    if (!design_name || !jewelry_id) {
      return res.status(400).json({error: "Please fill in the required field!"})
    }
    
    try {
        
      const jewelryExists = await Jewelry.findById(jewelry_id);
        if (!jewelryExists) {
            return res.status(404).json({ error: 'No such jewelry with the given jewelry_id' });
        }

      const design = await Design.create({ design_name, jewelry_id, images })

      res.status(201).json(design)
    } catch (error) {
      res.status(500).json({ error: "Error while creating design" })
    }
  }

// delete a blog
const deleteDesign = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'Invalid ID'})
    }

    try {
      const design = await Design.findOneAndDelete({_id: id})

      if(!design) {
        return res.status(404).json({error: 'No such design'})
      }

      res.status(200).json(design)
    } catch (error) {
      res.status(500).json({ error: 'Error while getting design' })
    }
}
  
// update a design
const updateDesign = async (req, res) => {
    const { id } = req.params
    const { jewelry_id } = req.body; // Extract jewelry_id from request body
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid ID'})
    }
    
    try {
        // Check if the jewelry_id exists
        if(jewelry_id){
            if (!mongoose.Types.ObjectId.isValid(jewelry_id)) {
                return res.status(400).json({error: 'Invalid Jewelry ID'})
            }
            const jewelryExists = await Jewelry.findById(jewelry_id);
            if (jewelryExists) {
                const jewelryExists = await Jewelry.findById(jewelry_id);
            }    
            if (!jewelryExists) {
                return res.status(404).json({ error: 'No such jewelry with the given jewelry_id' });
            }
            
        }

        const design = await Design.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            {
                new: true, // Return the updated document
                runValidators: true
            }
        );

        if (!design) {
            return res.status(404).json({ error: 'No such design' });
        }

        res.status(200).json(design);
    } catch (error) {
        res.status(500).json({ error: 'Error while updating design' });
    }
}

module.exports = { getDesigns, getDesign, createDesign, deleteDesign, updateDesign }
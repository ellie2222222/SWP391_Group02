const Design = require('../models/designModel')
const mongoose = require('mongoose')
const Jewelry = require('../models/jewelryModel')
const jwt = require('jsonwebtoken')

// get all design
const getDesigns = async (req, res) => {
    try {
      const design = await Design.find({})

      res.status(200).json(design)
    } catch (error) {
      res.status(500).json({ error: 'Error while getting designs' })
    }
}

// get one blog
const getDesign = async (req, res) => {
    try {
      const { id } = req.params
      const { authorization } = req.headers;
      const token = authorization.split(' ')[1];
      const { _id, role } = jwt.verify(token, process.env.SECRET);

      if (role !== 'manager') {
          const uid = await Design.findById(id).select('user_id');
          if (!uid || uid.user_id.toString() !== _id) {
              return res.status(403).json({ error: 'You do not have permissions to perform this action' });
          }
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid ID'})
      }
    
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
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const { _id, role } = jwt.verify(token, process.env.SECRET);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({error: 'Invalid user ID'})
    }

    const { jewelry_id, images } = req.body

    if (!jewelry_id) {
      return res.status(400).json({error: "Please fill in the required field!"})
    }

    if (!mongoose.Types.ObjectId.isValid(jewelry_id)) {
      return res.status(400).json({error: 'Invalid jewelry ID'})
    }
    
    try {
      const jewelryExists = await Jewelry.findById(jewelry_id);
      if (!jewelryExists) {
          return res.status(404).json({ error: 'No such jewelry with the given jewelry_id' });
      }

      const jewelry = await Design.findOne({jewelry_id: jewelry_id})
      if (jewelry) {
        return res.status(400).json({ error: 'This jewelry already have a design' });
      }

      const design = await Design.create({ user_id: _id, jewelry_id, images })

      res.status(201).json(design)
    } catch (error) {
      res.status(500).json({ error: "Error while creating design" })
    }
  }

// delete a design
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
    try {
        const { id } = req.params
        const { jewelry_id, images } = req.body; // Extract jewelry_id from request body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid ID'})
        }

        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const { _id, role } = jwt.verify(token, process.env.SECRET);

        if (role !== 'manager') {
            const uid = await Design.findById(id).select('user_id');
            if (!uid || uid.user_id.toString() !== _id) {
                return res.status(403).json({ error: 'You do not have permissions to perform this action' });
            }
        }
    
        // Check if the jewelry_id exists
        if (jewelry_id) {
            if (!mongoose.Types.ObjectId.isValid(jewelry_id)) {
                return res.status(400).json({error: 'Invalid Jewelry ID'})
            }

            const jewelryExists = await Jewelry.findById(jewelry_id);
            if (!jewelryExists) {
                return res.status(404).json({ error: 'No such jewelry with the given jewelry_id' });
            }

            const jewelry = await Design.findOne({jewelry_id: jewelry_id})
            if (jewelry) {
              return res.status(400).json({ error: 'This jewelry already have a design' });
            }
        }

        const design = await Design.findOneAndUpdate(
            { _id: id },
            { $set: {
              design_name: req.body.design_name, 
              jewelry_id, 
              images: req.body.images 
            }},
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
        res.status(500).json({ error: "Error while updating design" });
    }
}

module.exports = { getDesigns, getDesign, createDesign, deleteDesign, updateDesign }
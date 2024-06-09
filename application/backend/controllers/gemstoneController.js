const Gemstone = require('../models/gemstoneModel')
const mongoose = require('mongoose')

// Get all gemstones or get gemstones by name
const getGemstones = async (req, res) => {
    const { name } = req.query;

    try {
        let query = {};
        if (name) {
            query.name = new RegExp(name, 'i'); // 'i' for case-insensitive search
        }

        const gemstones = await Gemstone.find(query);
        res.status(200).json(gemstones);
    } catch (error) {
        console.error('Error fetching gemstones:', error);
        res.status(500).json({ error: 'An error occurred while fetching gemstones' });
    }
};

// get one gemstone
const getGemstone = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid ID'})
      }
    
    try{ 
      const gemstone = await Gemstone.findById(id)
  
      if (!gemstone) {
          return res.status(404).json({error: 'No such gemstone'})
      }
      
      res.status(200).json(gemstone)
    } catch (error) {
      console.error('Error fetching gemstone:', error);
      res.status(500).json({ error: 'An error occurred while fetching gemstone' });
    }
    
}

const validateEmptyFields = (data) => {
  const { name, price, carat, cut, clarity, color } = data;
  let emptyFields = [];

  if (!name) {
      emptyFields.push('name');
  }
  if (!price) {
      emptyFields.push('price');
  }
  if (!carat) {
      emptyFields.push('carat');
  }
  if (!cut) {
      emptyFields.push('cut');
  }
  if (!clarity) {
      emptyFields.push('clarity');
  }
  if (!color) {
      emptyFields.push('color');
  }

  return emptyFields;
};

const validateInputData = (data) => {
  const { price, carat, cut, clarity, color } = data;
  let validationErrors = [];

  const validCuts = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  const validColors = ['Colorless', 'Near Colorless', 'Faint Yellow', 'Very Light Yellow', 'Light Yellow'];
  const validClarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];

  if (price != null && price <= 0) {
      validationErrors.push('Price must be a positive number');
  }
  if (carat != null && (typeof carat !== 'number' || carat <= 0)) {
      validationErrors.push('Carat must be a positive number');
  }
  if (cut && !validCuts.includes(cut)) {
      validationErrors.push('Cut must be one of ' + validCuts.join(', '));
  }
  if (clarity && !validClarities.includes(clarity)) {
      validationErrors.push('Clarity must be one of ' + validClarities.join(', '));
  }
  if (color && !validColors.includes(color)) {
      validationErrors.push('Color must be one of ' + validColors.join(', '));
  }

  return validationErrors;
};

const createGemstone = async (req, res) => {
  const emptyFields = validateEmptyFields(req.body);
  const validationErrors = validateInputData(req.body);

  if (emptyFields.length > 0 || validationErrors.length > 0) {
      return res.status(400).json({
          message: 'Validation failed',
          emptyFields,
          validationErrors,
      });
  }

  try {
      const gemstone = await Gemstone.create(req.body);
      res.status(201).json(gemstone);
  } catch (error) {
      console.error('Error creating gemstone:', error);
      res.status(500).json({ error: 'An error occurred while creating gemstone' });
  }
};

const updateGemstone = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
  }

  const validationErrors = validateInputData(req.body);

  if (validationErrors.length > 0) {
      return res.status(400).json({
          message: 'Validation failed',
          validationErrors,
      });
  }

  try {
      const gemstone = await Gemstone.findOneAndUpdate(
          { _id: id },
          req.body,
          {
              new: true, // Return the updated document
              runValidators: true,
          }
      );

      if (!gemstone) {
          return res.status(404).json({ error: 'No such gemstone' });
      }

      res.status(200).json(gemstone);
  } catch (error) {
      console.error('Error updating gemstone:', error);
      res.status(500).json({ error: 'An error occurred while updating gemstone' });
  }
};

const validatePriceUpdate = (data) => {
  const { price } = data;
  let validationErrors = [];

  if (price == null) {
      validationErrors.push('Price is required');
  } else if (price <= 0) {
      validationErrors.push('Price must be a positive number');
  }

  return validationErrors;
};

const updateGemstonePrice = async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
  }

  const validationErrors = validatePriceUpdate({ price });

  if (validationErrors.length > 0) {
      return res.status(400).json({
          message: 'Validation failed',
          validationErrors,
      });
  }

  try {
      const gemstone = await Gemstone.findOneAndUpdate(
          { _id: id },
          { price },
          {
              new: true, // Return the updated document
              runValidators: true,
          }
      );

      if (!gemstone) {
          return res.status(404).json({ error: 'No such gemstone' });
      }

      res.status(200).json(gemstone);
  } catch (error) {
      console.error('Error updating gemstone price:', error);
      res.status(500).json({ error: 'An error occurred while updating gemstone price' });
  }
};


// delete a gemstone
const deleteGemstone = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'Invalid ID'})
    }
    
    try {
      const gemstone = await Gemstone.findOneAndDelete({_id: id})

      if(!gemstone) {
      return res.status(400).json({error: 'No such gemstone'})
      }
  
      res.status(200).json(gemstone)
    } catch (error) {
      console.error('Error fetching gemstones:', error);
      res.status(500).json({ error: 'An error occurred while deleting gemstones' });
    }
}

module.exports = { getGemstones, getGemstone, createGemstone, deleteGemstone, updateGemstone, updateGemstonePrice }
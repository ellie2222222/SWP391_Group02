const Jewelry = require('../models/jewelryModel');
const mongoose = require('mongoose');

// Helper functions for validation
const validateEmptyFields = (data) => {
    const {
        name, description, gemstone_id, gemstone_weight,
        material_id, material_weight, price, category, model_type
    } = data;
    let emptyFields = [];

    if (!name) emptyFields.push('name');
    if (!description) emptyFields.push('description');
    if (!material_id) emptyFields.push('material_id');
    if (!material_weight) emptyFields.push('material_weight');
    if (!category) emptyFields.push('category');
    if (!price) emptyFields.push('price');
    if (!model_type) emptyFields.push('model_type');

    return emptyFields;
};

const validateInputData = (data) => {
    const { price, material_weight, gemstone_weight } = data;
    let validationErrors = [];

    if (price != null && (typeof price !== 'number' || price <= 0)) {
        validationErrors.push('Price must be a positive number');
    }
    if (material_weight != null && (typeof material_weight !== 'number' || material_weight <= 0)) {
        validationErrors.push('Material weight must be a positive number');
    }
    if (gemstone_weight != null && (typeof gemstone_weight !== 'number' || gemstone_weight <= 0)) {
        validationErrors.push('Gemstone weight must be a positive number');
    }

    return validationErrors;
};

// Get all jewelries
const getJewelries = async (req, res) => {
    try {
        const jewelries = await Jewelry.find({});
        res.status(200).json(jewelries);
    } catch (error) {
        res.status(500).json({ error: 'Error while getting jewelries' });
    }
};

// Get one jewelry
const getJewelry = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const jewelry = await Jewelry.findById(id);

        if (!jewelry) {
            return res.status(404).json({ error: 'No such jewelry' });
        }

        res.status(200).json(jewelry);
    } catch (error) {
        res.status(500).json({ error: 'Error while getting a jewelry' });
    }
};

// Create a new jewelry
const createJewelry = async (req, res) => {
    const emptyFields = validateEmptyFields(req.body);
    const validationErrors = validateInputData(req.body);

    if (emptyFields.length > 0 || validationErrors.length > 0) {
      return res.status(400).json({
          message: 'Validation failed',
          emptyFields,
          validationErrors
      });
    }

    try {
        const jewelry = await Jewelry.create(req.body);
        res.status(201).json(jewelry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a jewelry
const deleteJewelry = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const jewelry = await Jewelry.findOneAndDelete({ _id: id });

        if (!jewelry) {
            return res.status(404).json({ error: 'No such jewelry' });
        }

        res.status(200).json(jewelry);
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting jewelry' });
    }
};

// Update a jewelry
const updateJewelry = async (req, res) => {
    const { id } = req.params;
    const validationErrors = validateInputData(req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
          message: 'Validation failed',
          validationErrors,
      });
    }

    try {
        const jewelry = await Jewelry.findOneAndUpdate(
            { _id: id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!jewelry) {
            return res.status(404).json({ error: 'No such jewelry' });
        }

        res.status(200).json(jewelry);
    } catch (error) {
        res.status(500).json({ error: 'Error while updating jewelry' });
    }
};

module.exports = {
    getJewelries,
    getJewelry,
    createJewelry,
    deleteJewelry,
    updateJewelry
};
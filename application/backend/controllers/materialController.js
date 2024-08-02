const Material = require('../models/materialModel');
const mongoose = require('mongoose');

// Helper functions for validation
const validateEmptyFields = (data) => {
    const { name, buy_price, sell_price } = data;
    let emptyFields = [];

    if (!name) emptyFields.push('name');
    if (!buy_price) emptyFields.push('buy_price');
    if (!sell_price) emptyFields.push('sell_price');

    if (emptyFields.length > 0) {
        return `Please fill in the required fields: ${emptyFields.join(', ')}`;
    }

    return null;
};

const validateInputData = (data) => {
    const { buy_price, sell_price } = data;
    let validationErrors = [];

    if (buy_price != null && (typeof buy_price !== 'number' || buy_price <= 0)) {
        validationErrors.push('Buy price must be a positive number');
    }
    if (sell_price != null && (typeof sell_price !== 'number' || sell_price <= 0)) {
        validationErrors.push('Sell price must be a positive number');
    }

    return validationErrors;
};

// Get all materials or get materials by name
const getMaterials = async (req, res) => {
    const { name } = req.query;

    try {
        let query = {};
        if (name) {
            query.name = new RegExp(name, 'i'); // Case-insensitive search
        }

        const materials = await Material.find(query);
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching materials' });
    }
};

// Get one material
const getMaterial = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const material = await Material.findById(id);
        if (!material) {
            return res.status(404).json({ error: 'No such material' });
        }
        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the material' });
    }
};

// Create a new material
const createMaterial = async (req, res) => {
    const emptyFields = validateEmptyFields(req.body);
    const validationErrors = validateInputData(req.body);

    if (emptyFields) {
        return res.status(400).json({ error: emptyFields });
    }

    if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors });
    }

    try {
        const material = await Material.create(req.body);
        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the material' });
    }
};

// Delete a material
const deleteMaterial = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const material = await Material.findOneAndDelete({ _id: id });
        if (!material) {
            return res.status(404).json({ error: 'No such material' });
        }
        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the material' });
    }
};

// Update a material
const updateMaterial = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    const validationErrors = validateInputData(req.body);

    if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors });
    }

    try {
        const material = await Material.findOneAndUpdate(
            { _id: id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!material) {
            return res.status(404).json({ error: 'No such material' });
        }

        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the material' });
    }
};

module.exports = {
    getMaterials,
    getMaterial,
    createMaterial,
    deleteMaterial,
    updateMaterial
};

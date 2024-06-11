const Jewelry = require('../models/jewelryModel');
const mongoose = require('mongoose');

// Helper functions for validation
const validateEmptyFields = (data) => {
    const {
        name, description, gemstone_id, gemstone_weight,
        material_id, material_weight, price, category, type, on_sale, sale_percentage,
    } = data;
    let emptyFields = [];

    if (!name) emptyFields.push('name');
    if (!description) emptyFields.push('description');
    if (!gemstone_id) emptyFields.push('gemstone_id');
    if (!gemstone_weight) emptyFields.push('gemstone_weight');
    if (!material_id) emptyFields.push('material_id');
    if (!material_weight) emptyFields.push('material_weight');
    if (!category) emptyFields.push('category');
    if (!type) emptyFields.push('type');
    if (type && type === 'Sample' && !price) emptyFields.push('price');
    if (!on_sale) emptyFields.push('on_sale');
    if (!sale_percentage) emptyFields.push('sale_percentage');
    
    if (emptyFields.length > 0) {
        return "Please fill in the required field"
    }

    return null
};

const validateInputData = (data) => {
    const { gemstone_id, material_id, price, material_weight, gemstone_weight, sale_percentage, type } = data;
    let validationErrors = [];

    if (gemstone_id && !mongoose.Types.ObjectId.isValid(gemstone_id)) {
        validationErrors.push('Invalid gemstone ID')
    }
    if (material_id && !mongoose.Types.ObjectId.isValid(material_id)) {
        validationErrors.push('Invalid material ID')
    }
    if (price != null && (typeof price !== 'number' || price <= 0)) {
        validationErrors.push('Price must be a positive number');
    }
    if (material_weight != null && (typeof material_weight !== 'number' || material_weight <= 0)) {
        validationErrors.push('Material weight must be a positive number');
    }
    if (gemstone_weight != null && (typeof gemstone_weight !== 'number' || gemstone_weight <= 0)) {
        validationErrors.push('Gemstone weight must be a positive number');
    }
    if (sale_percentage != null && (typeof sale_percentage !== 'number' || sale_percentage < 0 || sale_percentage > 100)) {
        validationErrors.push('Sale percentage must be a positive number between 0 and 100');
    }

    const allowedType = ['Custom', 'Sample']

    if (!allowedType.includes(type)) {
        validationErrors.push("Invalid type");
    }

    return validationErrors;
};

// Create a new jewelry
const createJewelry = async (req, res) => {
    const emptyFields = validateEmptyFields(req.body);
    const validationErrors = validateInputData(req.body);

    if (emptyFields) {
        return res.status(400).json({
            error: emptyFields
        });
    }

    if (validationErrors.length > 0) {
        return res.status(400).json({
            error: validationErrors
        });
    }

    try {
        const jewelry = await Jewelry.create(req.body);
        res.status(201).json(jewelry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getJewelries = async (req, res) => {
    const { name, category } = req.query;

    try {
        let query = {};
        if (name) {
            query.name = new RegExp(name, 'i'); // 'i' for case-insensitive search
        }
        if (category) {
            query.category = category;
        }

        const jewelries = await Jewelry.find(query);
        res.status(200).json(jewelries);
    } catch (error) {
        res.status(500).json({ error: 'Error while getting jewelries' });
    }
};
// Get jewelries by category

// Get one jewelry
const getJewelry = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const jewelry = await Jewelry.findById(id)
            .populate('gemstone_id', 'name carat')
            .populate('material_id', 'name carat');

        if (!jewelry) {
            return res.status(404).json({ error: 'No such jewelry' });
        }

        res.status(200).json(jewelry);
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
            error: validationErrors
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

//get by name

module.exports = {
    getJewelries,
    getJewelry,
    createJewelry,
    deleteJewelry,
    updateJewelry
};
const Jewelry = require('../models/jewelryModel');
const mongoose = require('mongoose');
const streamifier = require('streamifier');
const { cloudinary } = require('../cloudinary');

// Helper functions for validation
const validateEmptyFields = (data) => {
    const {
        name, description,
        material_id, material_weight, price, category, type, on_sale, sale_percentage, available
    } = data;
    let emptyFields = [];

    if (!name) emptyFields.push('name');
    if (!description) emptyFields.push('description');
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
    let { gemstone_id, material_id, price, material_weight, sale_percentage, type, on_sale } = data;
    let validationErrors = [];

    if (gemstone_id) gemstone_id = gemstone_id.trim();
    if (material_id) material_id = material_id.trim();

    if (gemstone_id && !mongoose.Types.ObjectId.isValid(gemstone_id)) {
        validationErrors.push('Invalid gemstones ID');
    }
    if (material_id && !mongoose.Types.ObjectId.isValid(material_id)) {
        validationErrors.push('Invalid material ID');
    }

    // Convert values to numbers before checking
    price = parseFloat(price);
    material_weight = parseFloat(material_weight);
    sale_percentage = parseFloat(sale_percentage);

    if (price != null && (!Number.isFinite(price) || price <= 0)) {
        validationErrors.push('Price must be a positive number');
    }
    if (material_weight != null && (!Number.isFinite(material_weight) || material_weight <= 0)) {
        validationErrors.push('Material weight must be a positive number');
    }
    if (on_sale === 'false') {
        sale_percentage = 0;
    }
    if (on_sale === 'true' && sale_percentage <= 0) {
        validationErrors.push('Sale percentage must not 0 when it is on sale');
    }
    if (sale_percentage != null && (!Number.isFinite(sale_percentage) || sale_percentage < 0 || sale_percentage > 100)) {
        validationErrors.push('Sale percentage must be a positive number between 0 and 100');
    }

    const allowedType = ['Custom', 'Sample'];
    if (!allowedType.includes(type)) {
        validationErrors.push("Invalid type");
    }

    return validationErrors;
};

const createJewelry = async (req, res) => {
    try {
        // Log the request body and files for debugging
        console.log('Request Body:', req.body);
        console.log('Request Files:', req.files);

        let { name, description, price, gemstone_id, material_id, material_weight, category, type, on_sale, sale_percentage, available } = req.body;

        // Trim IDs
        if (gemstone_id) gemstone_id = gemstone_id.trim();
        if (material_id) material_id = material_id.trim();

        // Validate Empty Fields
        const emptyFieldsError = validateEmptyFields(req.body);
        if (emptyFieldsError) {
            return res.status(400).json({ error: emptyFieldsError });
        }

        // Validate Input Data
        const validationErrors = validateInputData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ error: validationErrors.join(', ') });
        }

        if (on_sale === 'false') {
            sale_percentage = 0;
        }

        const images = [];
        const image_public_ids = [];

        // Handle file uploads
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'jewelry' }, (error, result) => {
                        if (error) {
                            console.error('Upload Error:', error); // Log upload errors
                            reject(error);
                        } else {
                            images.push(result.secure_url);
                            image_public_ids.push(result.public_id);
                            resolve();
                        }
                    });
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                });
            });

            await Promise.all(uploadPromises);
        } else {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Create new jewelry item
        const newJewelry = new Jewelry({
            name,
            description,
            price,
            gemstone_id,
            material_id,
            material_weight,
            category,
            type,
            on_sale,
            sale_percentage,
            available,
            images,
            image_public_ids
        });

        await newJewelry.save();
        res.status(201).json(newJewelry);
    } catch (error) {
        console.error('Server Error:', error); // Log server errors
        res.status(500).json({ error: error.message });
    }
};

//update
const updateJewelry = async (req, res) => {
    try {
        let { 
            name, description, price, gemstone_id, 
            material_id, material_weight, category, type, on_sale, sale_percentage, available
        } = req.body;

        const emptyFieldsError = validateEmptyFields(req.body);
        if (emptyFieldsError) {
            return res.status(400).json({ error: emptyFieldsError });
        }

        const validationErrors = validateInputData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ error: validationErrors.join(', ') });
        }

        if (on_sale === 'false') {
            sale_percentage = 0;
        }

        const existingJewelry = await Jewelry.findById(req.params.id);
        if (!existingJewelry) {
            return res.status(404).json({ error: 'Jewelry not found' });
        }

        let updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (gemstone_id) updateData.gemstone_id = gemstone_id ? gemstone_id.trim() : null;
        if (material_id) updateData.material_id = material_id ? material_id.trim() : null;
        if (material_weight) updateData.material_weight = material_weight;
        if (category) updateData.category = category;
        if (type) updateData.type = type;
        if (on_sale) updateData.on_sale = on_sale;
        if (sale_percentage) updateData.sale_percentage = sale_percentage;
        if (available) updateData.available = available;

        if (req.files && req.files.length > 0) {
            const deletePromises = existingJewelry.image_public_ids.map(publicId => cloudinary.uploader.destroy(publicId));
            await Promise.all(deletePromises);

            const images = [];
            const image_public_ids = [];
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'jewelry' }, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            images.push(result.secure_url);
                            image_public_ids.push(result.public_id);
                            resolve();
                        }
                    });
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                });
            });
            
            await Promise.all(uploadPromises);

            updateData.images = images;
            updateData.image_public_ids = image_public_ids;
        }

        const updatedJewelry = await Jewelry.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updatedJewelry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getJewelries = async (req, res) => {
    const { name, available, category, type, on_sale, sortByPrice, sortBySalePercentage, sortByName, page = 1, limit = 12 } = req.query;

    try {
        let query = {};
        if (name) {
            query.name = new RegExp(name, 'i'); // 'i' for case-insensitive search
        }
        if (category) {
            query.category = new RegExp(category, 'i');
        }
        if (type) {
            query.type = new RegExp(type, 'i');
        }
        if (on_sale !== undefined && on_sale !== '') {
            query.on_sale = on_sale === 'true'; // Convert string to boolean
        }
        if (available !== undefined && available !== '') {
            query.available = available === 'true';
        }

        let sort = {};
        if (sortByPrice) {
            if (sortByPrice === 'asc') {
                sort.price = 1; // ascending
            } else if (sortByPrice === 'desc') {
                sort.price = -1; // descending
            }
        }
        if (sortBySalePercentage) {
            if (sortBySalePercentage === 'asc') {
                sort.sale_percentage = 1; // ascending
            } else if (sortBySalePercentage === 'desc') {
                sort.sale_percentage = -1; // descending
            }
        }
        if (sortByName) {
            if (sortByName === 'asc') {
                sort.name = 1; // ascending
            } else if (sortByName === 'desc') {
                sort.name = -1; // descending
            }
        }

        const skip = (page - 1) * limit;
        const jewelries = await Jewelry.find(query).sort(sort).skip(skip).limit(parseInt(limit));

        // Count total number of documents
        const total = await Jewelry.countDocuments(query);

        res.status(200).json({
            jewelries,
            total: total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        });
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
        const jewelry = await Jewelry.findById(id)
            .populate('gemstone_id', 'name carat cut clarity color')
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
        const jewelry = await Jewelry.findByIdAndDelete(id);

        if (!jewelry) {
            return res.status(404).json({ error: 'No such jewelry' });
        }

        // Delete associated images from Cloudinary
        const deletePromises = jewelry.image_public_ids.map(publicId => cloudinary.uploader.destroy(publicId));
        await Promise.all(deletePromises);

        res.status(200).json(jewelry);
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting jewelry' });
    }
};

module.exports = {
    getJewelries,
    getJewelry,
    createJewelry,
    deleteJewelry,
    updateJewelry
};
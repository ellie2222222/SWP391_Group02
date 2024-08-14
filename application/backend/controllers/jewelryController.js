const Jewelry = require('../models/jewelryModel');
const mongoose = require('mongoose');
const streamifier = require('streamifier');
const { cloudinary } = require('../utils/cloudinary');
const { getLogger } = require('../utils/logger');  // Import the getLogger function

// Create logger instances for different services
const productServiceLogger = getLogger('product-service');

// Helper functions for validation
const validateEmptyFields = (data) => {
    const { name, description, material_id, material_weight, price, category, type, available } = data;
    let emptyFields = [];

    if (!name) emptyFields.push('name');
    if (!description) emptyFields.push('description');
    if (!material_id) emptyFields.push('material_id');
    if (!material_weight) emptyFields.push('material_weight');
    if (!category) emptyFields.push('category');
    if (!type) emptyFields.push('type');
    if (type && type === 'Sample' && !price) emptyFields.push('price');

    if (emptyFields.length > 0) {
        return "Please fill in the required fields";
    }

    return null;
};

const validateInputData = (data) => {
    let { gemstone_ids, material_id, price, material_weight, subgemstone_ids, type } = data;
    let validationErrors = [];

    gemstone_ids = gemstone_ids.filter(id => id.trim() !== '');
    subgemstone_ids = subgemstone_ids.filter(id => id.trim() !== '');

    gemstone_ids.forEach(id => {
        if (id !== 'undefined' && !mongoose.Types.ObjectId.isValid(id)) {
            validationErrors.push('Invalid gemstone ID');
        }
    });

    subgemstone_ids.forEach(id => {
        if (id !== 'undefined' && !mongoose.Types.ObjectId.isValid(id)) {
            validationErrors.push('Invalid sub gemstone ID');
        }
    });

    const duplicateIds = gemstone_ids.filter(id => id !== 'undefined' && subgemstone_ids.includes(id));
    if (duplicateIds.length > 0) {
        validationErrors.push('Gemstone IDs cannot be duplicated');
    }

    price = parseFloat(price);
    material_weight = parseFloat(material_weight);

    if (price != null && (!Number.isFinite(price) || price <= 0)) {
        validationErrors.push('Price must be a positive number');
    }
    if (material_weight != null && (!Number.isFinite(material_weight) || material_weight <= 0)) {
        validationErrors.push('Material weight must be a positive number');
    }

    const allowedType = ['Custom', 'Sample'];
    if (type && !allowedType.includes(type)) {
        validationErrors.push("Invalid type");
    }

    return validationErrors;
};

const createJewelry = async (req, res) => {
    try {
        let { name, description, price, gemstone_ids, material_id, material_weight, subgemstone_ids, category, type, available } = req.body;

        if (typeof gemstone_ids === 'string') {
            gemstone_ids = gemstone_ids.split(',').map(id => id.trim());
        }
        if (typeof subgemstone_ids === 'string') {
            subgemstone_ids = subgemstone_ids.split(',').map(id => id.trim());
        }

        gemstone_ids = gemstone_ids.filter(id => id.trim() !== '');
        subgemstone_ids = subgemstone_ids.filter(id => id.trim() !== '');

        const emptyFieldsError = validateEmptyFields({ ...req.body, gemstone_ids, subgemstone_ids });
        if (emptyFieldsError) {
            productServiceLogger.warn(`Create Jewelry Failed: ${emptyFieldsError}`);
            return res.status(400).json({ error: emptyFieldsError });
        }

        const validationErrors = validateInputData({ ...req.body, gemstone_ids, subgemstone_ids });
        if (validationErrors.length > 0) {
            productServiceLogger.warn(`Create Jewelry Failed: ${validationErrors.join(', ')}`);
            return res.status(400).json({ error: validationErrors.join(', ') });
        }

        const images = [];
        const image_public_ids = [];

        if (req.files && req.files.length > 0) {
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
        }

        const newJewelry = new Jewelry({
            name,
            description,
            price,
            material_id,
            material_weight,
            category,
            type,
            available,
            images,
            image_public_ids,
            gemstone_ids,
            subgemstone_ids
        });

        const savedJewelry = await newJewelry.save();
        const populatedJewelry = await Jewelry.findById(savedJewelry._id)
            .populate('gemstone_ids')
            .populate('material_id')
            .populate('subgemstone_ids');

        productServiceLogger.info(`Jewelry Created: ${name}`);
        res.status(201).json(populatedJewelry);
    } catch (error) {
        productServiceLogger.error(`Create Jewelry Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const updateJewelry = async (req, res) => {
    try {
        let { name, description, price, gemstone_ids, material_id, material_weight, subgemstone_ids, category, type, available } = req.body;

        if (typeof gemstone_ids === 'string') {
            gemstone_ids = gemstone_ids.split(',').map(id => id.trim());
        }
        if (typeof subgemstone_ids === 'string') {
            subgemstone_ids = subgemstone_ids.split(',').map(id => id.trim());
        }

        gemstone_ids = gemstone_ids.filter(id => id.trim() !== '');
        subgemstone_ids = subgemstone_ids.filter(id => id.trim() !== '');

        const validationErrors = validateInputData({ ...req.body, gemstone_ids, subgemstone_ids });
        if (validationErrors.length > 0) {
            productServiceLogger.warn(`Update Jewelry Failed: ${validationErrors.join(', ')}`);
            return res.status(400).json({ error: validationErrors.join(', ') });
        }

        const existingJewelry = await Jewelry.findById(req.params.id);
        if (!existingJewelry) {
            productServiceLogger.warn(`Update Jewelry Failed: Jewelry not found with ID ${req.params.id}`);
            return res.status(404).json({ error: 'Jewelry not found' });
        }

        let updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (material_id) updateData.material_id = material_id.trim();
        if (material_weight) updateData.material_weight = material_weight;
        if (category) updateData.category = category;
        if (type) updateData.type = type;
        if (available !== undefined) updateData.available = available;

        updateData.gemstone_ids = gemstone_ids.length > 0 ? gemstone_ids : [];
        updateData.subgemstone_ids = subgemstone_ids.length > 0 ? subgemstone_ids : [];

        updateData.images = existingJewelry.images || [];
        updateData.image_public_ids = existingJewelry.image_public_ids || [];

        if (req.body.removedImages && req.body.removedImages.length > 0) {
            const removedImages = Array.isArray(req.body.removedImages) ? req.body.removedImages : [req.body.removedImages];
            const deletePromises = removedImages.map(publicId => cloudinary.uploader.destroy(publicId));
            await Promise.all(deletePromises);

            updateData.images = updateData.images.filter(image => !removedImages.includes(image));
            updateData.image_public_ids = updateData.image_public_ids.filter(publicId => !removedImages.includes(publicId));
        }

        if (req.files && req.files.length > 0) {
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

            updateData.images = [...updateData.images, ...images];
            updateData.image_public_ids = [...updateData.image_public_ids, ...image_public_ids];
        }

        const updatedJewelry = await Jewelry.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('gemstone_ids')
            .populate('material_id')
            .populate('subgemstone_ids');
        productServiceLogger.info(`Jewelry Updated: ${updatedJewelry.name}`);
        res.status(200).json(updatedJewelry);
    } catch (error) {
        productServiceLogger.error(`Update Jewelry Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const updateJewelryAvailability = async (req, res) => {
    try {
        const { available } = req.body;

        if (typeof available !== 'boolean') {
            productServiceLogger.warn('Update Jewelry Availability Failed: "available" must be a boolean');
            return res.status(400).json({ error: 'Invalid data. "available" must be a boolean.' });
        }

        const updatedJewelry = await Jewelry.findByIdAndUpdate(
            req.params.id,
            { available },
            { new: true }
        );

        if (!updatedJewelry) {
            productServiceLogger.warn(`Update Jewelry Availability Failed: Jewelry not found with ID ${req.params.id}`);
            return res.status(404).json({ error: 'Jewelry not found' });
        }

        productServiceLogger.info(`Jewelry Availability Updated: ${updatedJewelry.name}`);
        res.status(200).json(updatedJewelry);
    } catch (error) {
        productServiceLogger.error(`Update Jewelry Availability Error: ${error.message}`);
        res.status(500).json({ error: 'Error while updating jewelry availability' });
    }
};

const getJewelries = async (req, res) => {
    const { name, available, category, type, sortByPrice, sortByName, page = 1, limit = 12 } = req.query;

    try {
        const query = {};
        const sort = {};
        const skip = (parseInt(page) - 1) * parseInt(limit);

        if (name) query.name = new RegExp(name, 'i');
        if (available) query.available = available === 'true';
        if (category) query.category = category;
        if (type) query.type = type;

        if (sortByPrice === 'asc') sort.price = 1;
        if (sortByPrice === 'desc') sort.price = -1;
        if (sortByName === 'asc') sort.name = 1;
        if (sortByName === 'desc') sort.name = -1;

        const jewelries = await Jewelry.find(query).sort({ createdAt: -1, ...sort }).skip(skip).limit(parseInt(limit))
            .populate('gemstone_ids')
            .populate('material_id')
            .populate('subgemstone_ids');

        const total = await Jewelry.countDocuments(query);

        productServiceLogger.info({ request_method: req.method, message: `Jewelries Retrieved: ${total} items` });
        res.status(200).json({
            jewelries,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        productServiceLogger.error({ request_method: req.method, message: `Get Jewelries Error: ${error.message}` });
        res.status(500).json({ error: 'Error while getting jewelries' });
    }
};

const getJewelry = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        productServiceLogger.warn(`Get Jewelry Failed: Invalid ID ${id}`);
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const jewelry = await Jewelry.findById(id)
            .populate('gemstone_ids')
            .populate('material_id')
            .populate('subgemstone_ids');

        if (!jewelry) {
            productServiceLogger.warn(`Get Jewelry Failed: Jewelry not found with ID ${id}`);
            return res.status(404).json({ error: 'No such jewelry' });
        }

        productServiceLogger.info(`Jewelry Retrieved: ${jewelry.name}`);
        res.status(200).json(jewelry);
    } catch (error) {
        productServiceLogger.error(`Get Jewelry Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const deleteJewelry = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        productServiceLogger.warn(`Delete Jewelry Failed: Invalid ID ${id}`);
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const jewelry = await Jewelry.findByIdAndDelete(id);

        if (!jewelry) {
            productServiceLogger.warn(`Delete Jewelry Failed: Jewelry not found with ID ${id}`);
            return res.status(404).json({ error: 'No such jewelry' });
        }

        const deletePromises = jewelry.image_public_ids.map(publicId => cloudinary.uploader.destroy(publicId));
        await Promise.all(deletePromises);

        productServiceLogger.info(`Jewelry Deleted: ${jewelry.name}`);
        res.status(200).json(jewelry);
    } catch (error) {
        productServiceLogger.error(`Delete Jewelry Error: ${error.message}`);
        res.status(500).json({ error: 'Error while deleting jewelry' });
    }
};

module.exports = {
    createJewelry,
    updateJewelry,
    updateJewelryAvailability,
    getJewelries,
    getJewelry,
    deleteJewelry,
};

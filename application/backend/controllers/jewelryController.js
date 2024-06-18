const Jewelry = require('../models/jewelryModel');
const mongoose = require('mongoose');
const streamifier = require('streamifier');
const { cloudinary } = require('../cloudinary');

// Helper functions for validation
const validateEmptyFields = (data) => {
    const {
        name, description,
        material_id, material_weight, price, category, type, on_sale, sale_percentage,
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
    let { gemstone_id, material_id, price, material_weight, gemstone_weight, sale_percentage, type } = data;
    let validationErrors = [];

    // Trim IDs if they exist
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
    gemstone_weight = parseFloat(gemstone_weight);
    sale_percentage = parseFloat(sale_percentage);

    if (price != null && (!Number.isFinite(price) || price <= 0)) {
        validationErrors.push('Price must be a positive number');
    }
    if (material_weight != null && (!Number.isFinite(material_weight) || material_weight <= 0)) {
        validationErrors.push('Material weight must be a positive number');
    }
    if (gemstone_weight != null && (!Number.isFinite(gemstone_weight) || gemstone_weight <= 0)) {
        validationErrors.push('Gemstone weight must be a positive number');
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
        const { name, description, price, gemstone_id, gemstone_weight, material_id, material_weight, category, type, on_sale, sale_percentage } = req.body;

        const emptyFieldsError = validateEmptyFields(req.body);
        if (emptyFieldsError) {
            return res.status(400).json({ error: emptyFieldsError });
        }

        const validationErrors = validateInputData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ error: validationErrors.join(', ') });
        }

        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'jewelry' }, (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }

            const newJewelry = new Jewelry({
                name,
                description,
                price,
                gemstone_id,
                gemstone_weight,
                material_id,
                material_weight,
                category,
                type,
                on_sale,
                sale_percentage,
                images: [result.secure_url],
                image_public_ids: [result.public_id] // Store public_id here
            });

            newJewelry.save().then(() => {
                res.status(201).json(newJewelry);
            }).catch(error => {
                res.status(500).json({ error: error.message });
            });
        });

        if (req.file && req.file.buffer) {
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
            res.status(400).json({ error: 'No file uploaded' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateJewelry = async (req, res) => {
    try {
        const { 
            name, description, price, gemstone_id, gemstone_weight, 
            material_id, material_weight, category, type, on_sale, sale_percentage 
        } = req.body;

        // Validate empty fields if necessary
        const emptyFieldsError = validateEmptyFields(req.body);
        if (emptyFieldsError) {
            return res.status(400).json({ error: emptyFieldsError });
        }

        // Validate input data
        const validationErrors = validateInputData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ error: validationErrors.join(', ') });
        }

        let updateData = {
            name,
            description,
            price,
            gemstone_id,
            gemstone_weight,
            material_id,
            material_weight,
            category,
            type,
            on_sale,
            sale_percentage,
            images,
        };

        if (req.file) {
            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'jewelry'
            });
            updateData.images = [result.secure_url];
        }

        const updatedJewelry = await Jewelry.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedJewelry) {
            return res.status(404).json({ error: 'Jewelry not found' });
        }

        let updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (gemstone_id) updateData.gemstone_id = gemstone_id ? gemstone_id.trim() : null;
        if (gemstone_weight) updateData.gemstone_weight = gemstone_weight;
        if (material_id) updateData.material_id = material_id ? material_id.trim() : null;
        if (material_weight) updateData.material_weight = material_weight;
        if (category) updateData.category = category;
        if (type) updateData.type = type;
        if (on_sale !== undefined) updateData.on_sale = on_sale;
        if (sale_percentage) updateData.sale_percentage = sale_percentage;

        if (req.file) {
            // Delete old image from Cloudinary
            const deletePromises = existingJewelry.image_public_ids.map(publicId => cloudinary.uploader.destroy(publicId));
            await Promise.all(deletePromises);

            // Upload new image to Cloudinary using the buffer
            const uploadStream = cloudinary.uploader.upload_stream({ folder: 'jewelry' }, async (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }

                updateData.images = [result.secure_url];
                updateData.image_public_ids = [result.public_id];

                // Perform the update after uploading the image
                try {
                    const updatedJewelry = await Jewelry.findByIdAndUpdate(req.params.id, updateData, { new: true });
                    res.status(200).json(updatedJewelry);
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            });

            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
            // Perform the update without uploading a new image
            const updatedJewelry = await Jewelry.findByIdAndUpdate(req.params.id, updateData, { new: true });
            res.status(200).json(updatedJewelry);
        }
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
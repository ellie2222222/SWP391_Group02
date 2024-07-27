const Gemstone = require('../models/gemstoneModel')
const mongoose = require('mongoose')
const streamifier = require('streamifier');
const { cloudinary } = require('../cloudinary');

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
        return res.status(400).json({ error: 'Invalid ID' })
    }

    try {
        const gemstone = await Gemstone.findById(id)

        if (!gemstone) {
            return res.status(404).json({ error: 'No such gemstone' })
        }

        res.status(200).json(gemstone)
    } catch (error) {
        console.error('Error fetching gemstone:', error);
        res.status(500).json({ error: 'An error occurred while fetching gemstone' });
    }

}

const validateEmptyFields = (data) => {
    const { name, price, carat, cut, clarity, color, measurements, polish, symmetry, fluorescence, comments } = data;
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
    if (!measurements) {
        emptyFields.push('measurements');
    }
    if (!polish) {
        emptyFields.push('polish');
    }
    if (!symmetry) {
        emptyFields.push('symmetry');
    }
    if (!fluorescence) {
        emptyFields.push('fluorescence');
    }
    if (!comments) {
        emptyFields.push('comments')
    }

    if (emptyFields.length > 0) {
        return "Please fill in the required field"
    }

    return null
};

const validateInputData = (data) => {
    const { price, carat, cut, clarity, color, polish, symmetry, fluorescence } = data;
    let validationErrors = [];

    const validCuts = ['Round', 'Princess', 'Emerald', 'Asscher', 'Marquise', 'Oval', 'Radiant', 'Pear', 'Heart', 'Cushion', 'Other'];
    const validColors = [
        'Colorless', 'Near Colorless', 'Faint Yellow', 'Very Light Yellow', 'Light Yellow',
        'Red', 'Orange', 'Green', 'Blue', 'Yellow', 'Purple', 'Pink', 'Brown', 'Black', 'White'
    ];
    const validClarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3', 'Other'];
    const validPolishs = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
    const validSymmetries = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
    const validFluorescences = ['None', 'Faint', 'Medium', 'Strong', 'Very Strong'];

    if (price != null && price <= 0) {
        validationErrors.push('Price must be a positive number');
    }
    if (carat != null && carat <= 0) {
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
    if (polish && !validPolishs.includes(polish)) {
        validationErrors.push('Polish must be one of ' + validPolishs.join(', '));
    }
    if (symmetry && !validSymmetries.includes(symmetry)) {
        validationErrors.push('Symmetry must be one of ' + validSymmetries.join(', '));
    }
    if (fluorescence && !validFluorescences.includes(fluorescence)) {
        validationErrors.push('Fluorescence must be one of ' + validFluorescences.join(', '));
    }

    return validationErrors;
};

const createGemstone = async (req, res) => {
    try {
        let { name, price, carat, cut, clarity, color, measurements, polish, symmetry, fluorescence, comments, available } = req.body;

        const emptyFieldsError = validateEmptyFields(req.body);
        if (emptyFieldsError) {
            return res.status(400).json({ error: emptyFieldsError });
        }

        const validationErrors = validateInputData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ error: validationErrors.join(', ') });
        }
        const certificate_image =[];
        const certificate_image_public_ids = [];

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'certificate' }, (error, result) => {
                        if (error) {
                            console.error('Upload Error:', error);
                            reject(error);
                        } else {
                            certificate_image.push(result.secure_url);
                            certificate_image_public_ids.push(result.public_id);
                            resolve();
                        }
                    });
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                });
            });

            await Promise.all(uploadPromises);
        }

        const newGemstone = new Gemstone({
            name,
            price,
            carat,
            cut,
            clarity,
            color,
            measurements,
            polish,
            symmetry,
            fluorescence,
            comments,
            available,
            certificate_image,
            certificate_image_public_ids
        });
        const savedGemstone = await newGemstone.save();
        res.status(201).json(savedGemstone);
    } catch (error) {
        console.error('Error while creating Gemstone', error);
        res.status(500).json({ error: error.message });
    }
};

const updateGemstone = async (req, res) => {
    try {
        let { name, price, carat, cut, clarity, color, measurements, polish, symmetry, fluorescence, comments, available } = req.body;

        const validationErrors = validateInputData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ error: validationErrors.join(', ') });
        }

        const existingGemstone = await Gemstone.findById(req.params.id);
        if (!existingGemstone) {
            return res.status(404).json({ error: 'Gemstone not found' });
        }

        let updateData = {};
        if (name) updateData.name = name;
        if (price) updateData.price = price;
        if (carat) updateData.carat = carat;
        if (cut) updateData.cut = cut;
        if (clarity) updateData.clarity = clarity;
        if (color) updateData.color = color;
        if (measurements) updateData.measurements = measurements;
        if (polish) updateData.polish = polish;
        if (symmetry) updateData.symmetry = symmetry;
        if (fluorescence) updateData.fluorescence = fluorescence;
        if (comments) updateData.comments = comments;
        if (available) updateData.available = available;

        // Initialize updateData.images and updateData.image_public_ids as arrays
        updateData.certificate_image = existingGemstone.certificate_image || [];
        updateData.certificate_image_public_ids = existingGemstone.certificate_image_public_ids || [];

        if (req.body.removedImages && req.body.removedImages.length > 0) {
            const removedImages = Array.isArray(req.body.removedImages) ? req.body.removedImages : [req.body.removedImages];
            const deletePromises = removedImages.map(publicId => cloudinary.uploader.destroy(publicId));
            await Promise.all(deletePromises);

            updateData.certificate_image = updateData.certificate_image.filter(image => !removedImages.includes(image));
            updateData.certificate_image_public_ids = updateData.certificate_image_public_ids.filter(publicId => !removedImages.includes(publicId));
        }

        const certificate_image =[];
        const certificate_image_public_ids = [];

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'certificate' }, (error, result) => {
                        if (error) {
                            console.error('Upload Error:', error);
                            reject(error);
                        } else {
                            certificate_image.push(result.secure_url);
                            certificate_image_public_ids.push(result.public_id);
                            resolve();
                        }
                    });
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                });
            });

            await Promise.all(uploadPromises);
        
            // Concatenate the new images and public IDs
            updateData.certificate_image = [...updateData.certificate_image, ...certificate_image];
            updateData.certificate_image_public_ids = [...updateData.certificate_image_public_ids, ...certificate_image_public_ids];
        }

        const updatedGemstone = await Gemstone.findByIdAndUpdate(req.params.id, updateData, { new: true })
        res.status(200).json(updatedGemstone);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// delete a gemstone
const deleteGemstone = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' })
    }

    try {
        const gemstone = await Gemstone.findOneAndDelete({ _id: id })

        if (!gemstone) {
            return res.status(400).json({ error: 'No such gemstone' })
        }

        // Delete associated images from Cloudinary
        const deletePromises = gemstone.certificate_image_public_ids.map(publicId => cloudinary.uploader.destroy(publicId));
        await Promise.all(deletePromises);

        res.status(200).json(gemstone)
    } catch (error) {
        console.error('Error deleting gemstones:', error);
        res.status(500).json({ error: 'An error occurred while deleting gemstones' });
    }
}

module.exports = { getGemstones, getGemstone, createGemstone, deleteGemstone, updateGemstone }
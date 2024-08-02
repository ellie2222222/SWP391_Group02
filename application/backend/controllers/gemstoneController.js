const Gemstone = require('../models/gemstoneModel')
const mongoose = require('mongoose')
const streamifier = require('streamifier');
const { cloudinary } = require('../cloudinary');

// Get all gemstones or get gemstones by name
const getGemstones = async (req, res) => {
    const { search, cut, clarity, color, polish, symmetry, fluorescence } = req.query;

    try {
        let query = {};
        if (search) {
            query.name = new RegExp(search, 'i');
        }
        if (cut) {
            query.cut = cut;
        }
        if (clarity) {
            query.clarity = clarity;
        }
        if (color) {
            query.color = color;
        }
        if (polish) {
            query.polish = polish;
        }
        if (symmetry) {
            query.symmetry = symmetry;
        }
        if (fluorescence) {
            query.fluorescence = fluorescence;
        }

        const gemstones = await Gemstone.find(query);

        res.status(200).json(gemstones);
    } catch (error) {
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
        res.status(500).json({ error: 'An error occurred while fetching gemstone' });
    }

}

const validateEmptyFields = (data) => {
    const { name, price, carat, cut, clarity, color, measurements, polish, symmetry, fluorescence } = data;
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

        let certificate_image = "";
        let certificate_image_public_ids = "";

        if (req.file) {
            try {
                // Upload the image to Cloudinary and store the result
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ folder: 'certificate' }, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }).end(req.file.buffer);
                });

                certificate_image = result.secure_url;
                certificate_image_public_ids = result.public_id;
            } catch (uploadError) {
                return res.status(500).json({ error: 'Error uploading certificate image' });
            }
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
        res.status(500).json({ error: 'Error while creating gemstone' });
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
        if (typeof available !== 'undefined') updateData.available = available;

        // Handle image upload and replacement
        let certificate_image = existingGemstone.certificate_image;
        let certificate_image_public_ids = existingGemstone.certificate_image_public_ids;

        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (certificate_image_public_ids) {
                await cloudinary.uploader.destroy(certificate_image_public_ids);
            }

            // Upload the new image
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: 'certificate' }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(req.file.buffer);
            });

            certificate_image = result.secure_url;
            certificate_image_public_ids = result.public_id;
        }

        // Update the gemstone with the new image data
        updateData.certificate_image = certificate_image;
        updateData.certificate_image_public_ids = certificate_image_public_ids;

        const updatedGemstone = await Gemstone.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updatedGemstone);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteGemstone = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        // Find and delete the gemstone
        const gemstone = await Gemstone.findByIdAndDelete(id);

        if (!gemstone) {
            return res.status(404).json({ error: 'No such gemstone' });
        }

        // Handle certificate_image_public_ids as a single string
        const publicId = gemstone.certificate_image_public_ids || '';

        // If there's a public ID, delete the associated image from Cloudinary
        if (publicId.length > 0) {
            await cloudinary.uploader.destroy(publicId);
        }

        res.status(200).json({ message: 'Gemstone deleted successfully', gemstone });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the gemstone', details: error.message });
    }
};

module.exports = { getGemstones, getGemstone, createGemstone, deleteGemstone, updateGemstone }
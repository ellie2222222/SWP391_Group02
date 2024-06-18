const WorksOn = require('../models/worksOnModel')
const Request = require('../models/requestModel')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

//check if an array of IDs exists in the database and has staffs role
const checkStaffRoles = async (staff_ids) => {
    const staff = await User.find({ _id: { $in: staff_ids }, role: { $in: ['manager', 'sale_staff', 'design_staff', 'production_staff'] } })
    if (staff.length !== staff_ids.length) {
        throw new Error('One or more staff IDs are invalid, do not have the appropriate role or duplicate IDs in input data')
    }
};
const checkStaffRole = async (staff_id) => {
    const staff = await User.findOne({ _id: staff_id, role: { $in: ['manager', 'sale_staff', 'design_staff', 'production_staff'] } });
    if (!staff) {
        throw new Error('Staff ID is invalid or does not have the appropriate role');
    }
};

// Create a new WorksOn
const createWorksOn = async (req, res) => {
    try {
        const { request_id } = req.body;
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const { _id } = jwt.verify(token, process.env.SECRET);

        // Check request_id
        const request = await Request.findById(request_id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' })
        }

        //Find manager
        const manager = await User.findOne({ role: "manager" })
        if (!manager) {
            return res.status(404).json({ error: 'No manager found' })
        }

        // add ids to list staff_ids
        const staff_ids = [new ObjectId(_id), manager._id]

        // Check staff_ids
        await checkStaffRoles(staff_ids);

        const worksOn = new WorksOn({
            request_id,
            staff_ids
        });

        await worksOn.save()

        res.status(201).json(worksOn)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// Get a WorksOn by ID
const getWorksOnById = async (req, res) => {
    try {
        const worksOn = await WorksOn.findById(req.params.id)
            // .populate('request_id')
            .populate('staff_ids');

        if (!worksOn) {
            return res.status(404).json({ error: 'WorksOn not found' })
        }

        res.json(worksOn);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// Get all WorksOns
const getAllWorksOns = async (req, res) => {
    try {
        const worksOns = await WorksOn.find()
            // .populate('request_id')
            .populate('staff_ids');

        res.json(worksOns);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a WorksOn by ID
const updateWorksOnById = async (req, res) => {
    try {
        const { id } = req.params
        const { request_id, endedAt } = req.body;

        // Check if worksOn id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" })
        }

        // Check if request id is valid
        if (!mongoose.Types.ObjectId.isValid(request_id)) {
            return res.status(400).json({ error: "Invalid request ID" })
        }

        // Check if the request_id exists
        const request = await Request.findById(request_id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' })
        }

        if (endedAt) {
            parsedEndAt = new Date(endedAt);
            if (isNaN(parsedEndAt)) {
                return res.status(400).json({ error: "Invalid end date" });
            }

            if (parsedEndAt <= request.createdAt) {
                return res.status(400).json({ error: "End date must be after creation date" });
            }
        } else {
            parsedEndAt = request.endedAt;
        }

        const updatedFields = {}
        if (request_id) updatedFields.request_id = request_id;
        if (endedAt) updatedFields.endedAt = endedAt;

        const worksOn = await WorksOn.findByIdAndUpdate(id, {
            request_id: updatedFields.request_id,
            endedAt: updatedFields.endedAt
        },
            {
                new: true, // Return the updated document
                runValidators: true
            }
        );

        if (!worksOn) {
            return res.status(404).json({ error: 'WorksOn not found' })
        }

        res.json(worksOn);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// Delete a WorksOn by ID
const deleteWorksOnById = async (req, res) => {
    try {
        const { id } = req.params

        // Check if works on id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" })
        }

        const worksOn = await WorksOn.findByIdAndDelete(id);

        if (!worksOn) {
            return res.status(404).json({ error: 'WorksOn not found' })
        }

        res.status(200).json(worksOn)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// Add a staff member to a WorksOn
const addStaffToWorksOn = async (req, res) => {
    try {
        const { id, staff_id } = req.params

        // Check if works on id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid works on ID" })
        }

        // Check if staff id is valid
        if (!mongoose.Types.ObjectId.isValid(staff_id)) {
            return res.status(400).json({ error: "Invalid staff ID" })
        }

        // Check if the WorksOn exists
        const worksOn = await WorksOn.findById(id)
        if (!worksOn) {
            return res.status(404).json({ error: 'WorksOn not found' })
        }

        // Check if the staff_id is valid and has the appropriate role
        await checkStaffRole(staff_id);

        // Add staff_id to the staff_ids array if it's not already included
        if (!worksOn.staff_ids.includes(staff_id)) {
            worksOn.staff_ids.push(staff_id)
            await worksOn.save()
        } else {
            return res.status(400).json({ error: "Staff already exist" })
        }

        res.status(200).json(worksOn)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// Remove a staff member from a WorksOn
const removeStaffFromWorksOn = async (req, res) => {
    try {
        const { id, staff_id } = req.params
        // Check if works on id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid works on ID" })
        }

        // Check if staff id is valid
        if (!mongoose.Types.ObjectId.isValid(staff_id)) {
            return res.status(400).json({ error: "Invalid staff ID" })
        }

        // Check if the WorksOn exists
        const worksOn = await WorksOn.findById(id)
        if (!worksOn) {
            return res.status(404).json({ error: 'WorksOn not found' });
        }

        // Remove staff_id from the staff_ids array
        worksOn.staff_ids = worksOn.staff_ids.filter(id => id.toString() !== staff_id);
        await worksOn.save();

        res.json(worksOn);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    createWorksOn,
    getWorksOnById,
    getAllWorksOns,
    updateWorksOnById,
    deleteWorksOnById,
    addStaffToWorksOn,
    removeStaffFromWorksOn
}



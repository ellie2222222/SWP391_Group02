const Workson = require('../models/worksonModel')
const Request = require('../models/requestModel')
const User = require('../models/userModel')

//check if an array of IDs exists in the database and has staffs role
const checkStaffRoles = async (staff_ids) => {
    const staff = await User.find({ _id: { $in: staff_ids }, role: { $in: ['sale_staff', 'design_staff', 'production_staff'] } })
    if (staff.length !== staff_ids.length) {
        throw new Error('One or more staff IDs are invalid or do not have the appropriate role')
    }
};
const checkStaffRole = async (staff_id) => {
    const staff = await User.findOne({ _id: staff_id, role: { $in: ['sale_staff', 'design_staff', 'production_staff'] } });
    if (!staff) {
        throw new Error('Staff ID is invalid or does not have the appropriate role');
    }
};

// Create a new Workson
const createWorkson = async (req, res) => {
    try {
        const { request_id, staff_ids, endedAt } = req.body;

        // Check request_id
        const request = await Request.findById(request_id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        // Check staff_ids
        await checkStaffRoles(staff_ids);

        const workson = new Workson({
            request_id,
            staff_ids,
            endedAt
        });

        await workson.save()

        res.status(201).json(workson)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// Get a Workson by ID
const getWorksonById = async (req, res) => {
    try {
        const workson = await Workson.findById(req.params.id)
            // .populate('request_id')
            // .populate('staff_ids');

        if (!workson) {
            return res.status(404).json({ message: 'Workson not found' })
        }

        res.json(workson);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// Get all Worksons
const getAllWorksons = async (req, res) => {
    try {
        const worksons = await Workson.find()
            // .populate('request_id')
            // .populate('staff_ids');

        res.json(worksons);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a Workson by ID
const updateWorksonById = async (req, res) => {
    try {
        const { request_id, staff_ids, endedAt } = req.body;

        // Check if the request_id exists
        const request = await Request.findById(request_id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        // Check if all staff_ids exist and have the appropriate role
        await checkStaffRoles(staff_ids);

        const workson = await Workson.findByIdAndUpdate(
            req.params.id,
            {
                request_id,
                staff_ids,
                endedAt
            },
            { new: true }
        );

        if (!workson) {
            return res.status(404).json({ message: 'Workson not found' })
        }

        res.json(workson);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// Delete a Workson by ID
const deleteWorksonById = async (req, res) => {
    try {
        const workson = await Workson.findByIdAndDelete(req.params.id);

        if (!workson) {
            return res.status(404).json({ message: 'Workson not found' })
        }

        res.json({ message: 'Workson deleted successfully' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// Add a staff member to a Workson
const addStaffToWorkson = async (req, res) => {
    try {
        const { id, staff_id } = req.params

        // Check if the Workson exists
        const workson = await Workson.findById(id)
        if (!workson) {
            return res.status(404).json({ message: 'Workson not found' })
        }

        // Check if the staff_id is valid and has the appropriate role
        await checkStaffRole(staff_id);

        // Add staff_id to the staff_ids array if it's not already included
        if (!workson.staff_ids.includes(staff_id)) {
            workson.staff_ids.push(staff_id)
            await workson.save()
        }

        res.json(workson)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// Remove a staff member from a Workson
const removeStaffFromWorkson = async (req, res) => {
    try {
        const { id, staff_id } = req.params

        // Check if the Workson exists
        const workson = await Workson.findById(id)
        if (!workson) {
            return res.status(404).json({ message: 'Workson not found' });
        }

        // Remove staff_id from the staff_ids array
        workson.staff_ids = workson.staff_ids.filter(id => id.toString() !== staff_id);
        await workson.save();

        res.json(workson);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = {
    createWorkson,
    getWorksonById,
    getAllWorksons,
    updateWorksonById,
    deleteWorksonById,
    addStaffToWorkson,
    removeStaffFromWorkson
}
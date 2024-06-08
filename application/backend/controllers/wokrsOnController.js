const WorksOn = require('../models/worksOnModel')
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

// Create a new WorksOn
const createWorksOn = async (req, res) => {
    try {
        const { request_id, staff_ids, endedAt } = req.body;

        // Check request_id
        const request = await Request.findById(request_id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        // Check staff_ids
        await checkStaffRoles(staff_ids);

        const worksOn = new WorksOn({
            request_id,
            staff_ids,
            endedAt
        });

        await worksOn.save()

        res.status(201).json(worksOn)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// Get a WorksOn by ID
const getWorksOnById = async (req, res) => {
    try {
        const worksOn = await WorksOn.findById(req.params.id)
            // .populate('request_id')
            .populate('staff_ids');

        if (!worksOn) {
            return res.status(404).json({ message: 'WorksOn not found' })
        }

        res.json(worksOn);
    } catch (error) {
        res.status(400).json({ message: error.message })
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
        res.status(400).json({ message: error.message });
    }
};

// Update a WorksOn by ID
const updateWorksOnById = async (req, res) => {
    try {
        const { request_id, staff_ids, endedAt } = req.body;

        // Check if the request_id exists
        const request = await Request.findById(request_id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        // Check if all staff_ids exist and have the appropriate role
        await checkStaffRoles(staff_ids);

        const worksOn = await WorksOn.findByIdAndUpdate(
            req.params.id,
            {
                request_id,
                staff_ids,
                endedAt
            },
            { new: true, // Return the updated document
            runValidators: true }
        );

        if (!worksOn) {
            return res.status(404).json({ message: 'WorksOn not found' })
        }

        res.json(worksOn);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// Delete a WorksOn by ID
const deleteWorksOnById = async (req, res) => {
    try {
        const worksOn = await WorksOn.findByIdAndDelete(req.params.id);

        if (!worksOn) {
            return res.status(404).json({ message: 'WorksOn not found' })
        }

        res.json({ message: 'WorksOn deleted successfully' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// Add a staff member to a WorksOn
const addStaffToWorksOn = async (req, res) => {
    try {
        const { id, staff_id } = req.params

        // Check if the WorksOn exists
        const worksOn = await WorksOn.findById(id)
        if (!worksOn) {
            return res.status(404).json({ message: 'WorksOn not found' })
        }

        // Check if the staff_id is valid and has the appropriate role
        await checkStaffRole(staff_id);

        // Add staff_id to the staff_ids array if it's not already included
        if (!worksOn.staff_ids.includes(staff_id)) {
            worksOn.staff_ids.push(staff_id)
            await worksOn.save()
        }

        res.json(worksOn)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// Remove a staff member from a WorksOn
const removeStaffFromWorksOn = async (req, res) => {
    try {
        const { id, staff_id } = req.params

        // Check if the WorksOn exists
        const worksOn = await WorksOn.findById(id)
        if (!worksOn) {
            return res.status(404).json({ message: 'WorksOn not found' });
        }

        // Remove staff_id from the staff_ids array
        worksOn.staff_ids = worksOn.staff_ids.filter(id => id.toString() !== staff_id);
        await worksOn.save();

        res.json(worksOn);
    } catch (error) {
        res.status(400).json({ message: error.message })
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
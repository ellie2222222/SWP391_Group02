const WorksOn = require('../models/worksOnModel')
const Request = require('../models/requestModel')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

//check if an array of IDs exists in the database and has staffs role
const checkStaffRoles = async (staff_ids) => {
    const staff = await User.find({
        _id: { $in: staff_ids },
        role: { $in: ['sale_staff', 'design_staff', 'production_staff'] }
    });
    if (staff.length !== staff_ids.length) {
        throw new Error('One or more staff IDs are invalid, do not have the appropriate role or duplicate IDs in input data');
    }
};
const checkStaffRole = async (staff_id) => {
    if (!ObjectId.isValid(staff_id)) {
        throw new Error('Staff ID is invalid');
    }

    const staff = await User.findOne({ _id: staff_id });

    if (!staff) {
        throw new Error('Staff ID does not exist');
    }

    if (!['sale_staff', 'design_staff', 'production_staff'].includes(staff.role)) {
        throw new Error('Staff does not have the appropriate role');
    }

    return staff.role;
};


// Create a new WorksOn
// const createWorksOn = async (req, res) => {
//     try {
//         const { request_id } = req.body;
//         const { authorization } = req.headers;
//         const token = authorization.split(' ')[1];
//         const { _id } = jwt.verify(token, process.env.SECRET);

//         // Check request_id
//         const request = await Request.findById(request_id);
//         if (!request) {
//             return res.status(404).json({ error: 'Request not found' })
//         }

//         //Find manager
//         const manager = await User.findOne({ role: "Manager@gmail.com" })
//         if (!manager) {
//             return res.status(404).json({ error: 'No manager found' })
//         }

//         // add ids to list staff_ids
//         const staff_ids = [new ObjectId(_id), manager._id]

//         // Check staff_ids
//         await checkStaffRoles(staff_ids);

//         const worksOn = new WorksOn({
//             request_id,
//             staff_ids
//         });

//         await worksOn.save()

//         res.status(201).json(worksOn)
//     } catch (error) {
//         res.status(400).json({ error: error.message })
//     }
// };

// Get a WorksOn by ID
const getWorksOnById = async (req, res) => {
    try {
        const worksOn = await WorksOn.findById(req.params.id)
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
// const updateWorksOnById = async (req, res) => {
//     try {
//         const { id } = req.params
//         const { request_id, endedAt } = req.body;

//         // Check if worksOn id is valid
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ error: "Invalid ID" })
//         }

//         // Check if request id is valid
//         if (!mongoose.Types.ObjectId.isValid(request_id)) {
//             return res.status(400).json({ error: "Invalid request ID" })
//         }

//         // Check if the request_id exists
//         const request = await Request.findById(request_id);
//         if (!request) {
//             return res.status(404).json({ error: 'Request not found' })
//         }

//         if (endedAt) {
//             parsedEndAt = new Date(endedAt);
//             if (isNaN(parsedEndAt)) {
//                 return res.status(400).json({ error: "Invalid end date" });
//             }

//             if (parsedEndAt <= request.createdAt) {
//                 return res.status(400).json({ error: "End date must be after creation date" });
//             }
//         } else {
//             parsedEndAt = request.endedAt;
//         }

//         const updatedFields = {}
//         if (request_id) updatedFields.request_id = request_id;
//         if (endedAt) updatedFields.endedAt = endedAt;

//         const worksOn = await WorksOn.findByIdAndUpdate(id, {
//             request_id: updatedFields.request_id,
//             endedAt: updatedFields.endedAt
//         },
//             {
//                 new: true, // Return the updated document
//                 runValidators: true
//             }
//         );

//         if (!worksOn) {
//             return res.status(404).json({ error: 'WorksOn not found' })
//         }

//         res.json(worksOn);
//     } catch (error) {
//         res.status(400).json({ error: error.message })
//     }
// };

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

// Get a WorksOn by request ID
const getWorksOnByRequestId = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid request ID" })
    }

    try {
        const worksOn = await WorksOn.findOne({ request_id: id })
            .populate({
                path: 'staff_ids',
                populate: 'staff_id',
            });

        if (!worksOn) {
            return res.status(404).json({ error: 'WorksOn entry not found' })
        }

        res.status(200).json({worksOn});
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving request information' })
    }
};

// Add a staff member to a WorksOn
const assignStaffToRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { staff } = req.body;

        // Check if request ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid request ID" });
        }

        // Check if the request exists
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if staff_id is valid and get staff role
        const staffRole = await checkStaffRole(staff._id);

        // Find or create the WorksOn entry
        let worksOn = await WorksOn.findOne({ request_id: request._id });
        if (!worksOn) {
            worksOn = new WorksOn({ request_id: request._id, staff_ids: [] });
        }

        // Check for duplicate staff_id in the staff_ids array
        const isDuplicate = worksOn.staff_ids.some(staffEntry => staffEntry.staff_id.toString() === staff._id.toString());
        if (isDuplicate) {
            return res.status(400).json({ error: 'Staff already exists in the request' });
        }

        // Check for duplicate roles
        const existingStaff = worksOn.staff_ids.find(staffEntry => staffEntry.role === staffRole);
        const words = staffRole.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
        const role = words.join(' ');
        if (existingStaff) {
            return res.status(400).json({ error: `This request already has ${role} role` });
        }

        // Add to staff_ids array with role and addedAt date
        worksOn.staff_ids.push({
            staff_id: staff._id,
            role: staffRole,
            addedAt: new Date()
        });

        // Automatically add manager if not already assigned
        const manager = await User.findOne({ role: "manager" });
        if (manager) {
            const isManagerDuplicate = worksOn.staff_ids.some(staffEntry => staffEntry.staff_id.toString() === manager._id.toString());
            if (!isManagerDuplicate) {
                worksOn.staff_ids.push({
                    staff_id: manager._id,
                    role: "manager",
                    addedAt: new Date()
                });
            }
        }

        await worksOn.save();
        res.status(200).json({worksOn});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove a staff member from a WorksOn
const removeStaffFromRequest = async (req, res) => {
    try {
        const { id } = req.params
        const { staff } = req.body;

        // Check if works on id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid request ID" })
        }

        // Check if the WorksOn exists
        const request = await Request.findById(id)
        if (!request) {
            return res.status(404).json({ error: 'Request not found' })
        }

        // Check if staff ids is valid
        await checkStaffRole(staff._id);

        // Check if the WorksOn exists
        let worksOn = await WorksOn.findOne({ request_id: request._id });
        if (!worksOn) {
            return res.status(404).json({ error: 'WorksOn entry not found' });
        }

        // Remove staff_id from the staff_ids array
        worksOn.staff_ids = worksOn.staff_ids.filter(worksOnStaff => worksOnStaff.staff_id.toString() !== staff._id.toString());
        await worksOn.save();

        res.status(200).json({worksOn});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    // createWorksOn,
    getWorksOnById,
    getAllWorksOns,
    // updateWorksOnById,
    deleteWorksOnById,
    assignStaffToRequest,
    removeStaffFromRequest,
    getWorksOnByRequestId,
}



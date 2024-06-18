const Request = require("../models/requestModel");
const WorksOn = require("../models/worksOnModel");
const Jewelry = require("../models/jewelryModel")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// get all requests
const getRequests = async (req, res) => {
  try {
    let request
    if (req.role === "sale_staff") {
      request = await Request.find({ request_status: "pending"});
    } else {
      request = await Request.find({});
    }    

    res.status(200).json(request);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: "An error occurred while fetching requests" });
  }
};

// get one request
const getRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({ error: "No such request" });
    }

    if (req.role === "sale_staff" && request.request_status !== "pending") {
      return res.status(403).json({ error: "You do not have permission to perform this action" })
    }

    res.status(200).json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: "An error occurred while fetching request" });
  }
};

// get user requests
const getUserRequests = async (req, res) => {
  try {
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const { _id } = jwt.verify(token, process.env.SECRET)

    const requests = await Request.find({ user_id: _id });

    // Check if requests exist
    if (requests.length === 0) {
      return res.status(404).json({ error: "No requests found" });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: "An error occurred while fetching your requests" });
  }
};

// get user requests
const getUserRequest = async (req, res) => {
  try {
    const { id } = req.params
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const { _id } = jwt.verify(token, process.env.SECRET)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const requests = await Request.findOne({ user_id: _id, _id: id }); 

    // Check if requests exist
    if (requests.length === 0) {
      return res.status(404).json({ error: "No requests found" });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: "An error occurred while fetching your requests" });
  }
};

// get staff requests
const getStaffRequests = async (req, res) => {
  try {
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const { _id } = jwt.verify(token, process.env.SECRET)
  
    const worksOn = await WorksOn.find({ staff_ids: _id });
    
    const requestIds = worksOn.map(w => w.request_id);
    
    const requests = await Request.find({ _id: { $in: requestIds } });
    
    // Check if requests exist
    if (requests.length === 0) {
      return res.status(404).json({ error: "No requests found for this staff" });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: "An error occurred while fetching staff requests" });
  }
};

// get staff request
const getStaffRequest = async (req, res) => {
  try {
    const { id } = req.params
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const { _id } = jwt.verify(token, process.env.SECRET)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    // Find request
    const requests = await Request.findOne({ _id: id }); 
    
    // Check if requests exist
    if (!requests) {
      return res.status(404).json({ error: "No request found" });
    }

    // Check if request is staff's request
    const worksOn = await WorksOn.findOne({ request_id: requests._id, staff_ids: _id });

    if (!worksOn) {
        return res.status(403).json({ error: "You do not have permission to perform this action" });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: "An error occurred while fetching staff requests" });
  }
};

// Create a new request
const createRequest = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { _id } = jwt.verify(token, process.env.SECRET);

  const { request_description } = req.body;

  if (!request_description) {
    return res.status(400).json({ error: "Please provide a description for the request" });
  }

  // Initialize all fields with default or null values
  const newRequest = {
    user_id: _id,
    request_description,
    jewelry_id: null,
    request_status: 'pending',
    quote_content: null,
    quote_amount: null,
    quote_status: 'pending',
    production_start_date: null,
    production_end_date: null,
    production_cost: null,
    production_status: null,
    total_amount: null,
    endedAt: null
  };

  // Add to the database
  try {
    const request = await Request.create(newRequest);
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: "Error while creating request" });
  }
};

// Update request
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      jewelry_id,
      request_description,
      request_status,
      quote_content,
      quote_amount,
      quote_status,
      production_start_date,
      production_end_date,
      production_cost,
      production_status,
      total_amount,
      endedAt
    } = req.body;

    // Validate request ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Retrieve the existing request
    const existingRequest = await Request.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ error: "No such request" });
    }

    // Validate jewelry id and check if it already exists in another request
    if (jewelry_id) {
      const jewelry = await Jewelry.findById(jewelry_id);
      if (!jewelry) {
        return res.status(404).json({ error: 'No such jewelry' });
      }
    }

    // Validate request status
    const allowedRequestStatuses = ['pending', 'assigned', 'completed'];
    if (request_status && !allowedRequestStatuses.includes(request_status)) {
      return res.status(400).json({ error: "Invalid request status" });
    }

    // Validate quote status
    const allowedQuoteStatuses = ["pending", "approved", "rejected"];
    if (quote_status && !allowedQuoteStatuses.includes(quote_status)) {
      return res.status(400).json({ error: "Invalid quote status" });
    }

    // Validate production status
    const allowedProductionStatuses = ["ongoing", "completed"];
    if (production_status && !allowedProductionStatuses.includes(production_status)) {
      return res.status(400).json({ error: "Invalid production status" });
    }

    // Validate quote amount
    if (quote_amount != null && (typeof quote_amount !== 'number' || quote_amount <= 0)) {
      return res.status(400).json('Quote amount must be a positive number');
    }

    // Validate total amount
    if (total_amount != null && (typeof total_amount !== 'number' || total_amount <= 0)) {
      return res.status(400).json('Total amount must be a positive number');
    }

    // Validate production cost
    if (production_cost != null && (typeof production_cost !== 'number' || production_cost <= 0)) {
      return res.status(400).json('Production cost must be a positive number');
    }

    // Validate and parse dates if provided
    let parsedStartDate, parsedEndDate, parsedEndAt;

    if (production_start_date) {
      parsedStartDate = new Date(production_start_date);
      if (isNaN(parsedStartDate)) {
        return res.status(400).json({ error: "Invalid production start date" });
      }
    } else {
      parsedStartDate = existingRequest.production_start_date;
    }

    if (production_end_date) {
      parsedEndDate = new Date(production_end_date);
      if (isNaN(parsedEndDate)) {
        return res.status(400).json({ error: "Invalid production end date" });
      }
    } else {
      parsedEndDate = existingRequest.production_end_date;
    }

    if (endedAt) {
      parsedEndAt = new Date(endedAt);
      if (isNaN(parsedEndAt)) {
        return res.status(400).json({ error: "Invalid end date" });
      }
      
      if (parsedEndAt <= existingRequest.createdAt) {
        return res.status(400).json({ error: "End date must be after creation date" });
      }
    } else {
      parsedEndAt = existingRequest.endedAt;
    }

    // Only update fields that are provided
    const updateFields = {};

    if (jewelry_id !== undefined) updateFields.jewelry_id = jewelry_id;
    if (request_description !== undefined) updateFields.request_description = request_description;
    if (request_status !== undefined) updateFields.request_status = request_status;
    if (quote_content !== undefined) updateFields.quote_content = quote_content;
    if (quote_amount !== undefined) updateFields.quote_amount = quote_amount;
    if (quote_status !== undefined) updateFields.quote_status = quote_status;
    if (production_start_date !== undefined) updateFields.production_start_date = parsedStartDate;
    if (production_end_date !== undefined) updateFields.production_end_date = parsedEndDate;
    if (production_cost !== undefined) updateFields.production_cost = production_cost;
    if (production_status !== undefined) updateFields.production_status = production_status;
    if (production_status !== undefined) updateFields.production_status = production_status;
    if (total_amount !== undefined) updateFields.total_amount = total_amount;
    if (endedAt !== undefined) updateFields.endedAt = parsedEndAt;

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "No such request" });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: "Error while updating request" });
  }
};

module.exports = {
  getRequests,
  getRequest,
  createRequest,
  getStaffRequests,
  getStaffRequest,
  getUserRequests,
  getUserRequest,
  updateRequest
};

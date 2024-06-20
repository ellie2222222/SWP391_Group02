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
    
    const requests = await Request.find({ _id: { $in: requestIds } })
      .populate({
        path: 'user_id',
        select: 'email'
      });

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
    quote_status: null,
    design_status: null,
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
      design_status,
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
    const allowedRequestStatuses = ['pending', 'accepted', 'completed', 'quote', 'design', 'production', 'payment', 'cancelled'];
    if (request_status && !allowedRequestStatuses.includes(request_status)) {
      return res.status(400).json({ error: "Invalid request status" });
    }

    // Validate quote status
    const allowedQuoteStatuses = ["pending", "approved", "rejected"];
    if (quote_status && !allowedQuoteStatuses.includes(quote_status)) {
      return res.status(400).json({ error: "Invalid quote status" });
    }

    // Validate design status
    const allowedDesignStatuses = ["ongoing", "completed"];
    if (design_status && !allowedDesignStatuses.includes(design_status)) {
      return res.status(400).json({ error: "Invalid design status" });
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
    let parsedStartDate = production_start_date ? new Date(production_start_date) : existingRequest.production_start_date;
    
    if (production_start_date && isNaN(parsedStartDate)) {
      return res.status(400).json({ error: "Invalid production start date" });
    }

    let parsedEndDate = production_end_date ? new Date(production_end_date) : existingRequest.production_end_date;
    if (production_end_date && isNaN(parsedEndDate)) {
      return res.status(400).json({ error: "Invalid production end date" });
    }

    let parsedEndAt = endedAt ? new Date(endedAt) : existingRequest.endedAt;
    if (endedAt && (isNaN(parsedEndAt) || parsedEndAt <= existingRequest.createdAt)) {
      return res.status(400).json({ error: "End date must be valid and after creation date" });
    }

    // Only update fields that are provided
    const updateFields = {
      ...(jewelry_id !== undefined && { jewelry_id }),
      ...(request_description !== undefined && { request_description }),
      ...(request_status !== undefined && { request_status }),
      ...(quote_content !== undefined && { quote_content }),
      ...(quote_amount !== undefined && { quote_amount }),
      ...(quote_status !== undefined && { quote_status }),
      ...(design_status !== undefined && { design_status }),
      ...(production_start_date !== undefined && { production_start_date: parsedStartDate }),
      ...(production_end_date !== undefined && { production_end_date: parsedEndDate }),
      ...(production_cost !== undefined && { production_cost }),
      ...(production_status !== undefined && { production_status }),
      ...(total_amount !== undefined && { total_amount }),
      ...(endedAt !== undefined && { endedAt: parsedEndAt }),
    };
    
    if (
      (existingRequest.quote_amount == null || existingRequest.quote_content == null )
      &&
      quote_amount != null && quote_content != null 
    ) {
      updateFields.quote_status = 'pending';
      updateFields.request_status = 'quote';
    }

    if (
      (existingRequest.production_start_date == null || existingRequest.production_end_date == null || existingRequest.production_cost == null )
      &&
      production_start_date != null && production_start_date != null && production_cost != null
    ) {
      updateFields.production_status = 'ongoing';
      updateFields.request_status = 'production';
    }

    // Update
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

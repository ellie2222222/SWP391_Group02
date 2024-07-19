const Request = require("../models/requestModel");
const Jewelry = require("../models/jewelryModel")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const streamifier = require('streamifier');
const { cloudinary } = require('../cloudinary');
const ObjectId = mongoose.Types.ObjectId;

// get all requests
const getRequests = async (req, res) => {
  const { search, request_status, page = 1, limit = 10 } = req.query;

  try {
    // Construct base query object
    let query = {};
    if (request_status) {
      query.request_status = new RegExp(request_status, 'i'); // Case-insensitive search
    }

    const skip = (page - 1) * limit;

    let userFilter = {};
    if (search) {
      if (ObjectId.isValid(search)) {
        query._id = new ObjectId(search);
      } else {
        userFilter = { email: new RegExp(search, 'i') };
      }
    }

    // Role-based query adjustments
    if (req.role === "sale_staff") {
      query.$or = [
        { request_status: "pending" },
        { request_status: "warranty" }
      ];
    } else if (req.role === "design_staff") {
      query.request_status = "design";
    } else if (req.role === "production_staff") {
      query.request_status = "production";
    }

    // Fetch requests with pagination and population
    const requests = await Request.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate({
        path: 'user_id',
        select: 'email',
        match: userFilter
      })
      .populate({
        path: 'jewelry_id',
        populate: [
          { path: 'material_id' },
          { path: 'gemstone_id' }
        ]
      });

    // Filter out requests where user_id didn't match the search
    const filteredRequests = requests.filter(request => request.user_id);

    // Count total requests for pagination
    const totalRequests = await Request.countDocuments(query);

    res.status(200).json({
      requests: filteredRequests,
      total: totalRequests,
      totalPages: Math.ceil(totalRequests / limit),
      currentPage: parseInt(page),
    });
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
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const { _id } = jwt.verify(token, process.env.SECRET);

    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const requests = await Request.find({ user_id: _id })
      .populate('jewelry_id')
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count of requests
    const totalRequests = await Request.countDocuments({ user_id: _id });

    // Check if requests exist
    if (requests.length === 0) {
      return res.status(404).json({ error: "No requests found" });
    }

    res.status(200).json({
      requests,
      total: totalRequests,
      totalPages: Math.ceil(totalRequests / limit),
      currentPage: parseInt(page),
    });
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
    production_start_date: null,
    production_end_date: null,
    production_cost: null,
    endedAt: null,
    design_images: [],
    warranty_content: null,
    warranty_start_date: null,
    warranty_end_date: null,
    deposit_paid: false,
    final_paid: false,
    status_history: [{ status: 'pending', timestamp: new Date() }]
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
      production_start_date,
      production_end_date,
      production_cost,
      endedAt,
      warranty_content,
      warranty_start_date,
      warranty_end_date,
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

    // Validate jewelry ID
    if (jewelry_id) {
      const jewelry = await Jewelry.findById(jewelry_id);
      if (!jewelry) {
        return res.status(404).json({ error: 'No such jewelry' });
      }
    }

    // Validate request status
    const allowedRequestStatuses = ['pending', 'accepted', 'completed', 'quote', 'deposit', 'design', 'production', 'warranty', 'payment', 'cancelled', 'user_accepted'];
    if (request_status && !allowedRequestStatuses.includes(request_status)) {
      return res.status(400).json({ error: "Invalid request status" });
    }

    // Validate amounts
    if (quote_amount != null && (typeof quote_amount !== 'number' || quote_amount <= 0)) {
      return res.status(400).json('Quote amount must be a positive number');
    }

    if (production_cost != null && (typeof production_cost !== 'number' || production_cost <= 0)) {
      return res.status(400).json('Production cost must be a positive number');
    }

    // Validate and parse dates
    const parseDate = (date) => new Date(date);

    let parsedStartDate = production_start_date ? parseDate(production_start_date) : existingRequest.production_start_date;
    let parsedEndDate = production_end_date ? parseDate(production_end_date) : existingRequest.production_end_date;
    let parsedEndAt = endedAt ? parseDate(endedAt) : existingRequest.endedAt;
    let parsedWarrantyStartDate = warranty_start_date ? parseDate(warranty_start_date) : existingRequest.warranty_start_date;
    let parsedWarrantyEndDate = warranty_end_date ? parseDate(warranty_end_date) : existingRequest.warranty_end_date;

    if (production_start_date && isNaN(parsedStartDate)) {
      return res.status(400).json({ error: "Invalid production start date" });
    }

    if (production_end_date && isNaN(parsedEndDate)) {
      return res.status(400).json({ error: "Invalid production end date" });
    }

    if (endedAt && (isNaN(parsedEndAt) || parsedEndAt <= existingRequest.createdAt)) {
      return res.status(400).json({ error: "End date must be valid and after creation date" });
    }

    if (warranty_start_date && isNaN(parsedWarrantyStartDate)) {
      return res.status(400).json({ error: "Invalid warranty start date" });
    }

    if (warranty_end_date && isNaN(parsedWarrantyEndDate)) {
      return res.status(400).json({ error: "Invalid warranty end date" });
    }

    // Handle design_images upload
    const images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: 'design' }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              images.push(result.secure_url);
              resolve();
            }
          });
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });
      await Promise.all(uploadPromises);
    }

    // Update status history
    if (request_status) {
      const now = new Date();
      const statusIndex = existingRequest.status_history.findIndex(entry => entry.status === request_status);
      if (statusIndex !== -1) {
        existingRequest.status_history[statusIndex].timestamp = now;
      } else {
        existingRequest.status_history.push({ status: request_status, timestamp: now });
      }
    }

    // Prepare update fields
    const updateFields = {
      ...(jewelry_id !== undefined && { jewelry_id }),
      ...(request_description !== undefined && { request_description }),
      ...(request_status !== undefined && { request_status }),
      ...(quote_content !== undefined && (req.role === 'sale_staff' || req.role === 'manager') && { quote_content }),
      ...(quote_amount !== undefined && (req.role === 'sale_staff' || req.role === 'manager') && { quote_amount }),
      ...(production_start_date !== undefined && (req.role === 'production_staff' || req.role === 'manager') && { production_start_date: parsedStartDate }),
      ...(production_end_date !== undefined && (req.role === 'production_staff' || req.role === 'manager') && { production_end_date: parsedEndDate }),
      ...(production_cost !== undefined && (req.role === 'sale_staff' || req.role === 'production_staff' || req.role === 'manager') && { production_cost }),
      ...(endedAt !== undefined && { endedAt: parsedEndAt }),
      ...(images.length > 0 && (req.role === 'design_staff' || req.role === 'manager') && { design_images: images }),
      ...(warranty_content !== undefined && (req.role === 'sale_staff' || req.role === 'manager') && { warranty_content }),
      ...(warranty_start_date !== undefined && (req.role === 'sale_staff' || req.role === 'manager') && { warranty_start_date: parsedWarrantyStartDate }),
      ...(warranty_end_date !== undefined && (req.role === 'sale_staff' || req.role === 'manager') && { warranty_end_date: parsedWarrantyEndDate }),
      ...existingRequest.status_history.length && { status_history: existingRequest.status_history },
    };

    // Update the request
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "No such request" });
    }

    res.status(200).json({ message: "Update successfully", updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: error.message });
  }
};


const createOrderRequest = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { _id } = jwt.verify(token, process.env.SECRET);
  const { jewelry_id } = req.body;

  // Validate jewelry ID
  if (!mongoose.Types.ObjectId.isValid(jewelry_id)) {
    return res.status(400).json({ error: "Invalid jewelry ID" });
  }

  try {
    const jewelry = await Jewelry.findById(jewelry_id);
    if (!jewelry) {
      return res.status(404).json({ error: 'No such jewelry' });
    }

    // Initialize all fields with default or null values
    const newRequest = {
      user_id: _id,
      request_description: 'Sample Request',
      jewelry_id,
      request_status: 'pending',
      quote_content: null,
      quote_amount: null,
      quote_status: null,
      production_start_date: null,
      production_end_date: null,
      production_cost: null,
      endedAt: null,
      warranty_content: null,
      warranty_start_date: null,
      warranty_end_date: null,
      design_images: [],
      deposit_paid: null,
      final_paid: null,
      status_history: [{ status: 'pending', timestamp: new Date() }],
    };

    // Add to the database
    const request = await Request.create(newRequest);
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating order request:', error);
    res.status(500).json({ error: error.message });
  }
};

// User feedback quote
const userFeedbackQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_quote_feedback } = req.body;

    // Validate request ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Retrieve the existing request
    let existingRequest = await Request.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ error: "No such request" });
    }

    // Check if user_quote_feedback is provided
    if (!user_quote_feedback) {
      return res.status(400).json({ error: "Feedback content is required" });
    }

    // Update the user feedback for quote
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { $push: { user_feedback_quote: user_quote_feedback } }, // Ensure this matches your schema field name
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "No such request" });
    }

    res.status(200).json({ message: "Feedback updated successfully", updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: error.message });
  }
};

// Manager feedback quote
const managerFeedbackQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { manager_feedback_quote } = req.body;
    // Validate request ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Retrieve the existing request
    let existingRequest = await Request.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ error: "No such request" });
    }

    // Check if manager_feedback_quote is provided
    if (!manager_feedback_quote) {
      return res.status(400).json({ error: "Feedback content is required" });
    }

    // Update the manager feedback for quote
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { $push: { manager_feedback_quote: manager_feedback_quote } }, // Ensure this matches your schema field name
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "No such request" });
    }

    res.status(200).json({ message: "Feedback updated successfully", updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: error.message });
  }
};

// User feedback design
const userFeedbackDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_design_feedback } = req.body;

    // Validate request ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Retrieve the existing request
    let existingRequest = await Request.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ error: "No such request" });
    }

    // Check if user_design_feedback is provided
    if (!user_design_feedback) {
      return res.status(400).json({ error: "Feedback content is required" });
    }

    // Update the user feedback for design
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { $push: { user_feedback_design: user_design_feedback } }, // Ensure this matches your schema field name
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "No such request" });
    }

    res.status(200).json({ message: "Feedback updated successfully", updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRequests,
  getRequest,
  createRequest,
  getUserRequests,
  getUserRequest,
  updateRequest,
  createOrderRequest,
  userFeedbackQuote,
  userFeedbackDesign,
  managerFeedbackQuote
};

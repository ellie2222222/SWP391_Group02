const Request = require("../models/requestModel");
const WorksOn = require("../models/worksOnModel");
const Jewelry = require("../models/jewelryModel")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// get all requests
const getRequests = async (req, res) => {
  try {
    const request = await Request.find({});

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

// get staff requests
const getStaffRequests = async (req, res) => {
  try {
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const { _id } = jwt.verify(token, process.env.SECRET)

    const worksOn = await WorksOn.find({ user_id: _id }).select("request_id");

    const requestIds = worksOn.map(w => w.request_id);

    const requests = await Request.find({ _id: { $in: requestIds } });

    // Check if requests exist
    if (requests) {
      return res.status(404).json({ error: "No requests found for this staff" });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: "An error occurred while fetching staff requests" });
  }
};

// create a new request
const createRequest = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { _id } = jwt.verify(token, process.env.SECRET);

  const { request_description } = req.body;

  if (!request_description) {
    return res.status(400).json({ error: "Please provide a description for the request" });
  }

  // add to the database
  try {
    const request = await Request.create({ user_id: _id, request_description });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: "Error while creating request" });
  }
};

// Update request status
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      jewelry_id,
      request_description, request_status, 
      quote_content, quote_amount, quote_status, 
      production_start_date, production_end_date, production_cost, production_status 
    } = req.body;
    
    // Retrieve the existing request
    const existingRequest = await Request.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ error: "No such request" });
    }

    // Validate jewelry id and if jewelry id already exist in other request
    if (jewelry_id) {
      const jewelry = await Jewelry.findById(jewelry_id)
      if (!jewelry) {
          return res.status(404).json({ error: 'No such jewelry' });
      }

      const existJewelry = await Request.findOne({jewelry_id: jewelry_id})
      if (existJewelry) {
          return res.status(400).json({ error: 'This jewelry already have a request' });
      }
    }

    // Validate request ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Validate request status
    const allowedRequestStatuses = ["ongoing", "completed"];

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

    // Validate production cost
    if (production_cost != null && (typeof production_cost !== 'number' || production_cost <= 0)) {
      return res.status(400).json('Production cost must be a positive number');
    }

    // Validate and parse dates if provided
    let parsedStartDate, parsedEndDate;

    if (production_start_date) {
      parsedStartDate = new Date(production_start_date);
      if (isNaN(parsedStartDate)) {
        return res.status(400).json({ error: "Invalid request start date" });
      }
    } else {
      parsedStartDate = existingRequest.production_start_date;
    }

    if (production_end_date) {
      parsedEndDate = new Date(production_end_date);
      if (isNaN(parsedEndDate)) {
        return res.status(400).json({ error: "Invalid request end date" });
      }
    } else {
      parsedEndDate = existingRequest.production_end_date;
    }

    // Only update fields that are not null
    const updateFields = {};

    if (jewelry_id !== null) updateFields.jewelry_id = jewelry_id;
    if (request_description !== null) updateFields.request_description = request_description;
    if (request_status !== null) updateFields.request_status = request_status;
    if (quote_content !== null) updateFields.quote_content = quote_content;
    if (quote_amount !== null) updateFields.quote_amount = quote_amount;
    if (quote_status !== null) updateFields.quote_status = quote_status;
    if (production_start_date !== null) updateFields.production_start_date = parsedStartDate;
    if (production_end_date !== null) updateFields.production_end_date = parsedEndDate;
    if (production_cost !== null) updateFields.production_cost = production_cost;
    if (production_status !== null) updateFields.production_status = production_status;
    
    const request = await Request.findOneAndUpdate(
      { _id: id },
      { $set: { updateFields } },
      { new: true, runValidators: true }
    );
    
    if (!request) {
      return res.status(404).json({ error: "No such request" });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: "Error while updating request" });
  }
};

module.exports = {
  getRequests,
  getRequest,
  createRequest,
  getStaffRequests,
  getUserRequests,
  updateRequest
};

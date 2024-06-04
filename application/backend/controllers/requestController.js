const Request = require("../models/requestModel");
const WorksOn = require("../models/worksOnModel");
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
const getMyRequests = async (req, res) => {
  try {
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const { _id } = jwt.verify(token, process.env.SECRET)

    const requests = await Request.find({ user_id: _id });

    // Check if requests exist
    if (requests.length === 0) {
      return res.status(404).json({ error: "No requests found for this user" });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: "An error occurred while fetching your requests" });
  }
};

// get user requests
const getUserRequests = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const requests = await Request.find({ user_id: id });
    
    if (requests.length === 0) {
      return res.status(404).json({error: 'No request found for this user'});
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: "An error occurred while fetching user requests" });
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
    if (requests.length === 0) {
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

  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Please provide a description for the request" });
  }

  // add to the database
  try {
    const request = await Request.create({ user_id: _id, description });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: "An error occurred while creating the request" });
  }
};

// update request 
const updateRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.body.status) {
    // check valid status
    const allowedStatuses = ["ongoing", "completed"];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
  }

  if (req.body.jewelry_ids && req.body.jewelry_ids.length !== new Set(req.body.jewelry_ids).size) {
    return res.status(400).json({ error: "Duplicate jewelry IDs found" });
  }

  if (req.body.jewelry_ids && req.body.jewelry_ids.some(id => !mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).json({ error: "Invalid jewelry ID(s)" });
  }

  try {
    const request = await Request.findOneAndUpdate(
      { _id: id },
      { $set: { 
        status: req.body.status, 
        jewelry_ids: req.body.jewelry_ids
      }},
      { new: true, // Return the updated document
      runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ error: "No such request" });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  getUserRequests,
  getStaffRequests,
  getMyRequests,
};

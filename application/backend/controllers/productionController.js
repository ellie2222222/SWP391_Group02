const mongoose = require("mongoose");
const Production = require("../models/productionModel");
const Jewelry = require("../models/jewelryModel");
const jwt = require("jsonwebtoken")

// Get all productions
const getProductions = async (req, res) => {
  try {
    const productions = await Production.find({});

    res.status(200).json(productions);
  } catch (error) {
    console.error('Error fetching productions:', error);
    return res.status(500).json({ error: "An error occurred while fetching productions" });
  }
};

// Get one production
const getProduction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const { _id, role } = jwt.verify(token, process.env.SECRET);

    if (role !== 'manager') {
        const uid = await Production.findById(id).select('user_id');
        if (!uid || uid.user_id.toString() !== _id) {
            return res.status(403).json({ error: 'You do not have permissions to perform this action' });
        }
    }

    const production = await Production.findById(id);

    if (!production) {
      return res.status(404).json({ error: "No such production" });
    }

    res.status(200).json(production);
  } catch (error) {
    console.error('Error retrieving production:', error);
    res.status(500).json({ error: "Error while getting a production" });
  }
};

// Create a new production
const createProduction = async (req, res) => {
    const { jewelry_id, production_type, production_cost, production_start_date, production_end_date } = req.body;
  
    // Check if all required fields are provided
    if (!jewelry_id || !production_type || !production_cost || !production_start_date || !production_end_date) {
      return res.status(400).json({ error: "Please fill in all required fields!" });
    }
  
    // Validate production_cost
    if (production_cost <= 0) {
      return res.status(400).json({ error: "Production cost must be a positive number" });
    }
  
    // Validate dates
    const parsedStartDate = new Date(production_start_date);
    if (isNaN(parsedStartDate)) {
      return res.status(400).json({ error: "Invalid production start date" });
    }
    const parsedEndDate = new Date(production_end_date);
    if (isNaN(parsedEndDate)) {
      return res.status(400).json({ error: "Invalid production end date" });
    }
    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({ error: "Production end date must be after the start date" });
    }

    // Validate jewelry
    if (!mongoose.Types.ObjectId.isValid(jewelry_id)) {
      return res.status(400).json({ error: "Invalid jewelry ID" });
    }

    const jewelry = await Jewelry.findById(request_id)
    if (!jewelry) {
        return res.status(404).json({ error: 'No such jewelry' });
    }

    const existJewelry = await Production.findOne({jewelry_id: jewelry_id})
    if (existJewelry) {
        return res.status(400).json({ error: 'This jewelry already have a production' });
    }
  
    // Add to the database
    try {
      const production = await Production.create({
        jewelry_id,
        production_type,
        production_cost,
        production_start_date: parsedStartDate,
        production_end_date: parsedEndDate,
      });
  
      res.status(201).json(production);
    } catch (error) {
      console.error('Error creating production:', error);
      res.status(500).json({ error: "An error occurred while creating the production" });
    }
  };
  

// Update a production
const updateProduction = async (req, res) => {
  const { id } = req.params;
  const { production_type, production_cost, production_start_date, production_end_date, jewelry_id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (jewelry_id && !mongoose.Types.ObjectId.isValid(jewelry_id)) {
    return res.status(400).json({ error: "Invalid jewelry ID" });
  }

  if (production_cost != null && (typeof production_cost !== 'number' || production_cost <= 0)) {
    return res.status(400).json('Production cost must be a positive number');
  }

  // Validate and set dates if provided
  if (production_start_date) {
    const parsedStartDate = new Date(production_start_date);
    if (isNaN(parsedStartDate)) {
      return res.status(400).json({ error: "Invalid production start date" });
    }
    updateData.production_start_date = parsedStartDate;
  }

  if (production_end_date) {
    const parsedEndDate = new Date(production_end_date);
    if (isNaN(parsedEndDate)) {
      return res.status(400).json({ error: "Invalid production end date" });
    }
    if (parsedEndDate <= updateData.production_start_date) {
      return res.status(400).json({ error: "Production end date must be after the start date" });
    }
    updateData.production_end_date = parsedEndDate;
  }

  const allowedStatuses = ["design", "production"];

  if (production_type && !allowedStatuses.includes(production_type)) {
    return res.status(400).json({ error: "Invalid production type" });
  }

  const updateData = {};
  if (jewelry_id) updateData.jewelry_id = jewelry_id;
  if (production_cost) updateData.production_cost = production_cost;
  if (production_type) updateData.production_type = production_type;
  if (production_start_date) updateData.production_start_date = parsedStartDate;
  if (production_end_date) updateData.production_end_date = parsedEndDate;

  try {
    const production = await Production.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!production) {
      return res.status(404).json({ error: "No such production" });
    }

    res.status(200).json(production);
  } catch (error) {
    console.error('Error updating production:', error);
    res.status(500).json({ error: "An error occurred while updating the production" });
  }
};

const updateProductionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const allowedStatuses = ["ongoing", "completed"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  
  try {
    const production = await Production.findOneAndUpdate(
      { _id: id },
      { $set: status },
      { new: true, runValidators: true }
    );

    if (!production) {
      return res.status(404).json({ error: "No such production" });
    }

    res.status(200).json(production);
  } catch (error) {
    console.error('Error updating production:', error);
    res.status(500).json({ error: "An error occurred while updating the production" });
  }
};

module.exports = { getProductions, getProduction, createProduction, updateProduction, updateProductionStatus };
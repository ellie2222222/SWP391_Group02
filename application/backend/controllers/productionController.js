const mongoose = require("mongoose");
const Production = require("../models/productionModel");
const User = require("../models/userModel");
const Jewelry = require("../models/jewelryModel");

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
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const production = await Production.findById(id);

    if (!production) {
      return res.status(404).json({ error: "No such production" });
    }

    res.status(200).json(production);
  } catch (error) {
    console.error('Error retrieving production:', error);
    res.status(500).json({ error: "An error occurred while retrieving the production" });
  }
};

// Create a new production
const createProduction = async (req, res) => {
    const { production_cost, production_start_date, production_end_date } = req.body;
  
    // Check if all required fields are provided
    if (!production_cost || !production_start_date || !production_end_date) {
      return res.status(400).json({ error: "Please fill in all required fields!" });
    }
  
    // Validate production_cost
    if (production_cost <= 0) {
      return res.status(400).json({ error: "Labor cost must be a positive number" });
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
  
    // Add to the database
    try {
      const production = await Production.create({
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
  const { production_start_date, production_end_date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const updateData = {};

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
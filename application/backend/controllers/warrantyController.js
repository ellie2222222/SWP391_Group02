const Warranty = require("../models/warrantyModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Jewelry = require("../models/jewelryModel");

// get all warranties
const getWarranties = async (req, res) => {
  try {
    const warranty = await Warranty.find({});

    res.status(200).json(warranty);
  } catch (error) {
    console.error('Error fetching warranties:', error);
    return res.status(500).json({ error: "An error occurred while fetching warranties" });
  }
};

// get one warranty
const getWarranty = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const warranty = await Warranty.findById(id);

    if (!warranty) {
      return res.status(404).json({ error: "No such warranty" });
    }

    res.status(200).json(warranty);
  } catch (error) {
    console.error('Error retrieving warranty:', error);
    res.status(500).json({ error: "An error occurred while retrieving the warranty" });
  }
};


// Create a new warranty
const createWarranty = async (req, res) => {
  const { warranty_content, user_id, jewelry_id, warranty_end_date } = req.body;

  if (!warranty_content || !user_id || !jewelry_id || !warranty_end_date) {
    return res.status(400).json({ error: "Please fill in all required fields!" });
  }

  // Validate date
  const parsedDate = new Date(warranty_end_date);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ error: "Invalid warranty end date" });
  }

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(jewelry_id)) {
    return res.status(400).json({ error: "Invalid jewelry ID" });
  }

  // Add to the database
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const jewelry = await Jewelry.findById(jewelry_id);
    if (!jewelry) {
      return res.status(404).json({ error: "Jewelry not found" });
    }

    const warranty = await Warranty.create({
      user_id,
      jewelry_id,
      warranty_content,
      warranty_end_date: parsedDate,
    });

    res.status(201).json(warranty);
  } catch (error) {
    console.error('Error creating warranty:', error);
    res.status(500).json({ error: error.message });
  }
};  

// update a warranty
const updateWarranty = async (req, res) => {
  const { id } = req.params;
  const { ...updateData } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (updateData.warranty_end_date) {
    const parsedDate = new Date(updateData.warranty_end_date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid warranty end date" });
    }
    updateData.warranty_end_date = parsedDate;
  }

  try {
    const warranty = await Warranty.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, // Return the updated document
      runValidators: true }
    );

    if (!warranty) {
      return res.status(404).json({ error: "No such warranty" });
    }

    res.status(200).json(warranty);
  } catch (error) {
    console.error('Error updating warranty:', error);
    res.status(500).json({ error: "An error occurred while updating the warranty" });
  }
};

module.exports = { getWarranties, getWarranty, createWarranty, updateWarranty };

const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: "3d" });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id, user.role);

    res.status(200).json({ user_id: user._id, email, token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { username, email, password, phone_number, address } = req.body;

  try {
    const user = await User.signup(
      username,
      email,
      password,
      phone_number,
      address
    );

    const token = createToken(user._id, user.role);

    res.status(201).json({ user_id: user._id, email, token, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Convert id to ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: "An error occurred while deleting the user" });
  }
};

const assignRole = async (req, res) => {
  const { id } = req.params
  const { role } = req.body;

  // check valid user id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  // check valid role
  const allowedRoles = [
    "user",
    "manager",
    "sale_staff",
    "design_staff",
    "production_staff",
  ];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { role } },
      { new: true } // Return the updated document
    );

    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error('Error assigning role:', error);
    return res.status(500).json({ error: "An error occurred while assigning the role" });
  }
};

module.exports = { signupUser, loginUser, deleteUser, assignRole };

const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");

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

    res.status(200).json({ token });
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

    res.status(201).json({ token });
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

// get all users
const getUsers = async (req, res) => {
  const { username, sort } = req.query;

  try {
    let query = {};
    if (username) {
      query.username = new RegExp(username, 'i'); // 'i' for case-insensitive search
    }

    // Determine the sort field and order
    let sortField = {};
    if (sort) {
      const [field, order] = sort.split('_');
      sortField[field] = order === 'asc' ? 1 : -1;
    }

    const users = await User.find(query).sort(sortField);

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: "Error while getting users" });
  }
}


const getUser = async (req, res) => {
  try {
    const { id } = req.params

    // check valid user id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const user = await User.findOne({_id: id})

    if (!user) {
      return res.status(404).json({ error: "No users found" })
    }

    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ error: "Error while getting users" })
  }
}

const changePassword = async (req, res) => {
  const { email, password, newpassword, confirmpassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the current password is correct
    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Check if new password and confirm password match
    if (newpassword !== confirmpassword) {
      return res.status(400).json({ error: "New password and confirm password do not match" });
    }
    
    // Validate the new password
    if (!validator.isStrongPassword(newpassword)) {
      return res.status(400).json({ error: "New password is not strong enough" });
    }
    
    // Hash the new password and update it
    user.password = newpassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ error: "An error occurred while changing the password" });
  }
};


module.exports = { signupUser, loginUser, deleteUser, assignRole, getUsers, getUser, changePassword };

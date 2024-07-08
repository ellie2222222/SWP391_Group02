const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: "30m" });
};

const createRefreshToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id, user.role);
    const refreshToken = createRefreshToken(user._id, user.role);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    res.status(200).json({ token, refreshToken});
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

    const users = await User.find(query)
      .select('-password')
      .sort(sortField);

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

const forgotPassword = async (req, res) => {
  console.log("Forgot password request received");
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or your preferred email service provider
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://localhost:3000/reset/${user._id}/${token}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Password reset email sent:', response);
      res.status(200).json({ message: 'Email sent successfully' });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if(err) {
      return res.json({Status: "Token error"})
    } else {
      bcrypt.hash(password, 10)
      .then(hash => {
        User.findByIdAndUpdate({_id: id}, {password: hash})
        .then(u => res.send({Status: "Success"}))
        .catch(err => res.send({Status: err}))
      })
      .catch(err => res.send({Status: err}))
    }
  })
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  console.log("refresh:", refreshToken);

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const token = createToken(decoded._id, decoded.role);
    // const currentTime = new Date().toLocaleString(); // Get current time

    res.json({ token, existToken: true });
    // console.log("access:", token);
    // // Log token creation time and expiration
    // console.log(`Token created at: ${currentTime}`);
    // console.log(`Token expires at: ${new Date(decoded.exp * 1000).toLocaleString()}`);
  });
};

// Logout user
const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.sendStatus(200);
};



module.exports = { signupUser, loginUser, deleteUser, assignRole, getUsers, getUser, forgotPassword, resetPassword, refreshToken, logout };
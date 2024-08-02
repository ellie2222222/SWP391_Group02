const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const nodemailer = require('nodemailer');
const WorksOn = require('../models/worksOnModel');
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

    res.status(200).json({ token, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { username, email, password, role,phone_number, address } = req.body;

  try {
    const user = await User.signup(
      username,
      email,
      password,
      role,
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
    res.status(500).json({ error: "An error occurred while deleting the user" });
  }
};

// update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Convert id to ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the user" });
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
    return res.status(500).json({ error: "An error occurred while assigning the role" });
  }
};

// get all users
// get all users
const getUsers = async (req, res) => {
  const { search, sort, role, page = 1, limit = 10 } = req.query;

  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { username: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ]
      };
    }
    if (role) {
      query.role = new RegExp(role, 'i');
    }

    // Determine the sort field and order
    let sortField = {};
    if (sort) {
      const [field, order] = sort.split('_');
      sortField[field] = order === 'asc' ? 1 : -1;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort(sortField)
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      users,
      total: totalUsers,
      totalPages
    });
  } catch (error) {
    return res.status(500).json({ error: "Error while getting users" });
  }
}

const getStaffs = async (req, res) => {
  const { search, sort, role, page = 1, limit = 10 } = req.query;

  try {
    let query = {
      role: { $nin: ['user', 'admin'] }  // Exclude 'user' and 'admin' roles
    };
    
    if (search) {
      query.$or = [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    
    if (role && !['user', 'admin'].includes(role.toLowerCase())) {
      query.role = {
        ...query.role,
        $regex: new RegExp(role, 'i')
      };
    }

    // Determine the sort field and order
    let sortField = {};
    if (sort) {
      const [field, order] = sort.split('_');
      sortField[field] = order === 'asc' ? 1 : -1;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort(sortField)
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      users,
      total: totalUsers,
      totalPages
    });
  } catch (error) {
    return res.status(500).json({ error: "Error while getting staffs" });
  }
}

const getUser = async (req, res) => {
  try {
    const { id } = req.params

    // check valid user id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const user = await User.findOne({ _id: id })

    if (!user) {
      return res.status(404).json({ error: "No users found" })
    }

    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ error: "Error while getting users" })
  }
}

const getStaffContact = async (req, res) => {
  try {
    const { request_id } = req.params;

    // Find the WorksOn document for the specific request_id
    const worksOnDocument = await WorksOn.findOne({ request_id });

    if (!worksOnDocument) {
      return res.status(404).json({ message: 'WorksOn document not found for the specified request' });
    }

    const saleStaffEntry = worksOnDocument.staff_ids.find(staff => staff.role === 'sale_staff');

    if (!saleStaffEntry) {
      return res.status(404).json({ message: 'Sale staff not assigned to this request' });
    }

    const saleStaffUser = await User.findById(saleStaffEntry.staff_id, 'phone_number');

    if (!saleStaffUser) {
      return res.status(404).json({ message: 'Sale staff user not found' });
    }

    res.status(200).json({ saleStaffContact: saleStaffUser.phone_number });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
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
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Email sent successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json('Password is not strong enough');
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.json({ Status: "Token error" })
    } else {
      bcrypt.hash(password, 10)
        .then(hash => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then(u => res.send({ Status: "Success" }))
            .catch(err => res.send({ Status: err }))
        })
        .catch(err => res.send({ Status: err }))
    }
  })
};

const resetProfilePassword = async (req, res) => {
  const { id } = req.body;
  const { oldPassword, password } = req.body;

  if (!validator.isStrongPassword(password)) {
    return res.status(400).send({ Status: 'Password is not strong enough' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ Status: 'User not found' });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).send({ Status: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword; 
    await user.save();

    res.send({ Status: 'Password updated successfully' });
  } catch (err) {
    res.status(500).send({ Status: err.message });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const token = createToken(decoded._id, decoded.role);
    // const currentTime = new Date().toLocaleString(); // Get current time

    res.json({ token, existToken: true });
  });
};

// Logout user
const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.sendStatus(200);
};



module.exports = { signupUser, loginUser, updateUser, deleteUser, assignRole, getUsers, getUser, forgotPassword, resetPassword, refreshToken, logout, resetProfilePassword, getStaffContact, getStaffs };
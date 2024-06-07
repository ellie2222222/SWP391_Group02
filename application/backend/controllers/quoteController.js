const Quote = require('../models/quoteModel');
const Request = require('../models/requestModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Get all quotes
const getQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find({});
        res.status(200).json(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Error retrieving quotes' });
    }
};

// Get a single quote
const getQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const { _id, role } = jwt.verify(token, process.env.SECRET);

        if (role !== 'manager') {
            const uid = await Quote.findById(id).select('user_id');
            if (!uid || uid.user_id.toString() !== _id) {
                return res.status(403).json({ error: 'You do not have permissions to perform this action' });
            }
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid ID' });
        }
   
        const quote = await Quote.findById(id);

        if (!quote) {
            return res.status(404).json({ error: 'No such quote' });
        }

        res.status(200).json(quote);
    } catch (error) {
        console.error('Error fetching quote:', error);
        res.status(500).json({ error: 'An error occurred while fetching the quote' });
    }
};

// Create a new quote
const createQuote = async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        const { request_id, content, amount } = req.body;

        if (!content || !amount || !request_id) {
            return res.status(400).json({ error: 'Please fill in the required fields!' });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
        }

        if (request_id) {
            const request = await Request.findById(request_id)
            if (!request) {
                return res.status(404).json({ error: 'No such request' });
            }

            const existRequest = await Quote.findOne({request_id: request_id})
            if (existRequest) {
                return res.status(400).json({ error: 'This request already have a quote' });
            }
        }

        const quote = await Quote.create({ user_id: _id, request_id, content, amount });
        res.status(201).json(quote);
    } catch (error) {
        console.error('Error creating quote:', error);
        res.status(500).json({ error: 'An error occurred while creating the quote' });
    }
};

// Update quote status
const updateQuoteStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    const allowedStatuses = ["pending", "approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const quote = await Quote.findOneAndUpdate(
            { _id: id },
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!quote) {
            return res.status(404).json({ error: 'No such quote' });
        }

        res.status(200).json(quote);
    } catch (error) {
        console.error('Error updating quote status:', error);
        res.status(500).json({ error: 'An error occurred while updating the quote status' });
    }
};

// Update a quote
const updateQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const { _id, role } = jwt.verify(token, process.env.SECRET);

        if (role !== 'manager') {
            const uid = await Quote.findById(id).select('user_id');
            if (!uid || uid.user_id.toString() !== _id) {
                return res.status(403).json({ error: 'You do not have permissions to perform this action' });
            }
        }

        const { request_id, content, amount } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        if (request_id && !mongoose.Types.ObjectId.isValid(request_id)) {
            return res.status(400).json({ error: 'Invalid request ID' });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
        }

        if (request_id) {
            const request = await Request.findById(request_id);
            if (!request) {
                return res.status(404).json({ error: 'No such request' });
            }

            const existingQuote = await Quote.findOne({ request_id: request_id });
            if (existingQuote) {
                return res.status(400).json({ error: 'This request already has a quote' });
            }
        }

        const quote = await Quote.findOneAndUpdate(
            { _id: id },
            { $set: { request_id, content, amount } },
            { new: true, runValidators: true }
        );

        if (!quote) {
            return res.status(404).json({ error: 'No such quote' });
        }

        res.status(200).json(quote);
    } catch (error) {
        console.error('Error updating quote:', error);
        res.status(500).json({ error: 'Error while updating quote' });
    }
};

const deleteQuote = async (req, res) => {
    try {
      const { id } = req.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      } 
  
      const quote = await Quote.findOneAndDelete({_id: id})
      if (!quote) {
        return res.status(404).json({ error: "No such quote" });
      }

      return res.status(200).json(quote);
    } catch (error) {
      res.status(500).json({ error: "Error while deleting quote" });
    }
  }


module.exports = { getQuote, getQuotes, createQuote, updateQuoteStatus, updateQuote, deleteQuote };

const Quote = require('../models/quoteModel');
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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID' });
    }

    try {
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
        const { content, amount } = req.body;

        if (!content || !amount) {
            return res.status(400).json({ error: 'Please fill in the required fields!' });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
        }

        const quote = await Quote.create({ user_id: _id, content, amount });
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
    const { id } = req.params;
    const { content, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    if (typeof amount !== 'number' || price <= 0 && amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    try {
        const quote = await Quote.findOneAndUpdate(
            { _id: id },
            { $set: { content, amount } },
            { new: true, runValidators: true }
        );

        if (!quote) {
            return res.status(404).json({ error: 'No such quote' });
        }

        res.status(200).json(quote);
    } catch (error) {
        console.error('Error updating quote:', error);
        res.status(500).json({ error: 'An error occurred while updating the quote' });
    }
};

module.exports = { getQuote, getQuotes, createQuote, updateQuoteStatus, updateQuote };

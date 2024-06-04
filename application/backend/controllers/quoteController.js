const Quote = require('../models/quoteModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

// get all Quotes
const getQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find({});
        res.status(200).json(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Error retrieving quotes'});
    }
}

// get one Quote
const getQuote = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID' })
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
}

// create a new Quote
const createQuote = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const { _id } = jwt.verify(token, process.env.SECRET)
    const { content, amount } = req.body

    if (!content || !amount) {
        return res.status(400).json({ error: "Please fill in the required field!" })
    }

    try {
        const quote = await Quote.create({ user_id: _id, content, amount });

        res.status(201).json(quote);
    } catch (error) {
        console.error('Error creating quote:', error);
        res.status(500).json({ error: 'An error occurred while creating quote' });
    }
}

const updateQuoteStatus = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' })
    }

    const allowedStatuses = ["pending", "approved", "rejected"]

    if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({ error: "Invalid status" })
    }
    

    try {
        // Find and update the quote
        const quote = await Quote.findOneAndUpdate(
            { _id: id },
            { $set: { status: req.body.status } },
            { new: true, // Return the updated document
            runValidators: true } 
        );

        if (!quote) {
            return res.status(404).json({ error: 'No such quote' });
        }

        res.status(200).json(quote);
    } catch (error) {
        console.error('Error updating quote status:', error);
        res.status(500).json({ error: 'An error occurred while updating the quote status' });
    }
}

module.exports = { getQuote, getQuotes, createQuote, updateQuoteStatus }
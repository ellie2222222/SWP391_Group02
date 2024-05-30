const Quote = require('../models/quoteModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

// get all Quotes
const getQuotes = async (req, res) => {
    const quote = await Quote.find({})

    res.status(200).json(quote)
}

// get one Quote
const getQuote = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such quote' })
    }

    const quote = await Quote.findById(id)

    if (!quote) {
        return res.status(404).json({ error: 'No such quote' })
    }

    res.status(200).json(quote)
}

// create a new Quote
const createQuote = async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const { _id } = jwt.verify(token, process.env.SECRET);

    const { content, amount } = req.body

    if (!content || !amount) {
        return res.status(400).json({ error: "Please fill in the required field!" })
    }

    // add to the database
    try {
        const quote = await Quote.create({ user_id: _id, content, amount })
        res.status(200).json(quote)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateQuoteStatus = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such Quote' })
    }

    const allowedStatuses = ["pending", "approved", "rejected"]

    if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({ error: "Invalid status" })
    }

    const quote = await Quote.findOneAndUpdate(
        { _id: id },
        { $set: { status: req.body.status } },
        { new: true } // Return the updated document
    )

    if (!quote) {
        return res.status(400).json({ error: 'No such quote' })
    }

    res.status(200).json(quote)
}

module.exports = { getQuote, getQuotes, createQuote, updateQuoteStatus }
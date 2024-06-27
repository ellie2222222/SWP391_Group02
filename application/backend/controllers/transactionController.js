const mongoose = require('mongoose');
const Request = require('../models/requestModel')
const Transaction = require('../models/transactionModel')

const createTransaction = async (req, res) => {
    const { trans_id, request_id} = req.body
    try {
        const request = await Request.findById(request_id);
        if (!request) {
            return res.status(400).json({error: "Request not found"})
        }
        if (request.request_status === 'warranty') {
            return res.status(400).json({error: "This order request has already been paid for"})
        }
        if (request.request_status !== 'payment' && request.request_status !== 'warranty') {
            return res.status(400).json({error: "Undone request, cannot proceed to transaction"})
        }

        const transaction = new Transaction({
            _id: trans_id,
            request_id: request_id
        });

        const savedTransaction = await transaction.save();

        return res.status(201).json(savedTransaction)
    } catch (error) {
        return res.status(500).json({ error: "Error while creating transaction"})
    }
};

const getTransactionById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        return res.status(200).json(transaction);
    } catch (error) {
        return res.status(500).json({ error: 'Error while retrieving transaction' });
    }
};

module.exports = { 
    createTransaction, 
    getTransactionById 
};
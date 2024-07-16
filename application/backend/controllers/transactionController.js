const mongoose = require('mongoose');
const Request = require('../models/requestModel')
const Transaction = require('../models/transactionModel')

const createTransaction = async (req, res) => {
    const { trans_id, request_id, type } = req.body
    try {
        const existingTransaction = await Transaction.findById(trans_id);
        if (existingTransaction) {
            return res.status(400).json({ error: "Transaction ID already exists" });
        }
        
        const request = await Request.findById(request_id);

        if (!request) {
            return res.status(400).json({error: "Request not found"})
        }
        if (request.request_status === 'warranty') {
            return res.status(400).json({error: "This order request has already been paid for"})
        }
        if(request.request_status !== 'deposit' && request.request_status !== 'payment' && request.request_status !== 'warranty') {
            return res.status(400).json({error: "Cannot proceed to transaction"})
        }

        const allowedTypes = ['deposit', 'final'];
        if (type && !allowedTypes.includes(type)) {
            return res.status(400).json({ error: "Invalid transaction type" });
        }

        let amountPaid;
        if (type === 'deposit') {
            amountPaid = request.quote_amount * 10 / 100;
          } else if (type ==='final') {
            amountPaid = request.quote_amount * 90 / 100
          }

        const transaction = new Transaction({
            _id: trans_id,
            request_id: request._id,
            amount_paid: amountPaid,
            type: type,
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
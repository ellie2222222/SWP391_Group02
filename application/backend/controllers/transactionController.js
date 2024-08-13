const mongoose = require('mongoose');
const Request = require('../models/requestModel');
const Transaction = require('../models/transactionModel');
const { getLogger } = require('../utils/logger');  // Import the getLogger function

// Create logger instances for different services
const transactionServiceLogger = getLogger('transaction-service');

// Create a new transaction
const createTransaction = async (req, res) => {
    const { trans_id, request_id, type } = req.body;
    try {
        transactionServiceLogger.info('Create transaction request received', { trans_id, request_id, type });

        const existingTransaction = await Transaction.findById(trans_id);
        if (existingTransaction) {
            transactionServiceLogger.warn('Transaction ID already exists', { trans_id });
            return res.status(400).json({ error: "Transaction ID already exists" });
        }
        
        const request = await Request.findById(request_id);
        if (!request) {
            transactionServiceLogger.warn('Request not found', { request_id });
            return res.status(400).json({ error: "Request not found" });
        }
        if (request.request_status === 'warranty') {
            transactionServiceLogger.warn('Order request has already been paid for', { request_id });
            return res.status(400).json({ error: "This order request has already been paid for" });
        }
        if (request.request_status !== 'deposit_design' && request.request_status !== 'deposit_production' && request.request_status !== 'payment' && request.request_status !== 'warranty') {
            transactionServiceLogger.warn('Cannot proceed to transaction', { request_status: request.request_status });
            return res.status(400).json({ error: "Cannot proceed to transaction" });
        }

        const allowedTypes = ['deposit_design', 'deposit_production', 'final'];
        if (type && !allowedTypes.includes(type)) {
            transactionServiceLogger.warn('Invalid transaction type', { type });
            return res.status(400).json({ error: "Invalid transaction type" });
        }

        let amountPaid;
        if (type === 'deposit_design') {
            amountPaid = request.quote_amount * 20 / 100;
        } else if (type === 'deposit_production') {
            amountPaid = request.quote_amount * 30 / 100;
        } else if (type === 'final') {
            amountPaid = request.quote_amount * 50 / 100;
        }

        const transaction = new Transaction({
            _id: trans_id,
            request_id: request._id,
            amount_paid: amountPaid,
            type: type,
        });

        const savedTransaction = await transaction.save();
        transactionServiceLogger.info('Transaction created successfully', { transaction: savedTransaction });
        
        return res.status(201).json(savedTransaction);
    } catch (error) {
        transactionServiceLogger.error('Error while creating transaction', { error: error.message });
        return res.status(500).json({ error: "Error while creating transaction" });
    }
};

// Get a transaction by ID
const getTransactionById = async (req, res) => {
    const { id } = req.params;
    
    try {
        transactionServiceLogger.info('Get transaction request received', { id });

        const transaction = await Transaction.findById(id);
        if (!transaction) {
            transactionServiceLogger.warn('Transaction not found', { id });
            return res.status(404).json({ error: 'Transaction not found' });
        }

        return res.status(200).json(transaction);
    } catch (error) {
        transactionServiceLogger.error('Error while retrieving transaction', { error: error.message });
        return res.status(500).json({ error: 'Error while retrieving transaction' });
    }
};

module.exports = { 
    createTransaction, 
    getTransactionById 
};

const mongoose = require('mongoose');
const Invoice = require('../models/invoiceModel');
const User = require('../models/userModel');
const Request = require('../models/requestModel');
const Transaction = require('../models/transactionModel');
const ObjectId = mongoose.Types.ObjectId;
// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create invoice
const createInvoice = async (req, res) => {
    const { transaction_id, payment_method, payment_gateway, total_amount } = req.body;

    try {
        // Find the transaction by ID and populate the request_id
        const transaction = await Transaction.findById(transaction_id).populate('request_id');
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        const requestId = transaction.request_id._id;

        // Check if an invoice transaction of the same type already exists for this request
        const existingDepositDesignInvoice = await Invoice.exists({
            transaction_id,
            type: 'deposit_design',
        });
        if (existingDepositDesignInvoice) {
            return res.status(200).json({ error: 'The request already has an invoice of type deposit design' });
        }

        const existingDepositProductionInvoice = await Invoice.exists({
            transaction_id,
            type: 'deposit_production',
        });
        if (existingDepositProductionInvoice) {
            return res.status(200).json({ error: 'The request already has an invoice of type deposit production' });
        }

        const existingFinalInvoice = await Invoice.exists({
            transaction_id,
            type: 'final',
        });
        if (existingFinalInvoice) {
            return res.status(200).json({ error: 'The request already has an invoice of type final' });
        }

        // Check if total_amount is valid
        if (total_amount <= 0) {
            return res.status(400).json({ error: 'Total amount must be a positive number.' });
        }

        // Update the request status based on the invoice type
        let updatedRequest;
        if (transaction.type === 'deposit_design') {
            updatedRequest = await Request.findByIdAndUpdate(
                requestId,
                { $set: { request_status: 'design' } },
                { new: true, runValidators: true }
            );
        } else if (transaction.type === 'deposit_production') {
            updatedRequest = await Request.findByIdAndUpdate(
                requestId,
                { $set: { request_status: 'production' } },
                { new: true, runValidators: true }
            );
        } else if (transaction.type === 'final') {
            updatedRequest = await Request.findByIdAndUpdate(
                requestId,
                { $set: { request_status: 'warranty' } },
                { new: true, runValidators: true }
            );
        }

        // Update status history
        if (updatedRequest) {
            const now = new Date();
            const statusIndex = updatedRequest.status_history.findIndex(entry => entry.status === updatedRequest.request_status);

            if (statusIndex !== -1) {
                if (!updatedRequest.status_history[statusIndex].timestamp) {
                    updatedRequest.status_history[statusIndex].timestamp = now;
                }
            } else {
                updatedRequest.status_history.push({ status: updatedRequest.request_status, timestamp: now });
            }

            await updatedRequest.save();
        }

        // Create the invoice
        const invoice = new Invoice({ transaction_id, payment_method, payment_gateway, total_amount });
        await invoice.save();

        res.status(201).json({ invoice, updatedRequest });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Get an Invoice by ID
const getInvoiceById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid invoice ID' })
    }

    try {
        const invoice = await Invoice.findById(id).populate('jewelry_id');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json({ invoice });
    } catch (error) {
        res.status(400).json({ error: 'Error while retrieving invoice' });
    }
};

// Get an Invoice by Request ID
const getInvoiceByRequestId = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid invoice ID' })
    }

    try {
        const transaction = await Transaction.findOne({
            request_id: id,
            type: 'final'
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const invoice = await Invoice.findOne({
            transaction_id: transaction._id
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json({ invoice });
    } catch (error) {
        res.status(500).json({ message: 'Error while retrieving invoice' });
    }
};

// Get all Invoices
const getAllInvoices = async (req, res) => {
    const { page = 1, limit = 10, payment_method, payment_gateway, sortBy = 'createdAt', sortOrder = 'desc', search } = req.query;

    // Create filter object
    const filter = {};
    if (payment_method) filter.payment_method = new RegExp(payment_method, 'i');
    if (payment_gateway) filter.payment_gateway = new RegExp(payment_gateway, 'i');

    // Create sort object
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    try {
        if (search) {
            if (ObjectId.isValid(search)) {
                filter._id = new ObjectId(search);
            }
        }

        // Fetch invoices with filters, sorting, and pagination
        const invoices = await Invoice.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate({
                path: 'transaction_id',
                populate: {
                    path: 'request_id',
                    populate: {
                        path: 'user_id',
                    }
                }
            });

        // Get total count of filtered invoices
        const totalInvoices = await Invoice.countDocuments(filter);

        res.json({ totalInvoices, invoices, totalPages: Math.ceil(totalInvoices / limit) });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an Invoice by ID
const updateInvoiceById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || ('request_id' in updates && !mongoose.Types.ObjectId.isValid(updates.request_id))) {
        return res.status(400).json({ message: 'Invalid invoice ID or request_id format' });
    }

    try {
        // Check if the user_id exists and has the role 'user'
        if ('request_id' in updates) {
            const { request_id } = updates;
            const request = await Request.findById(request_id);
            if (!request) {
                return res.status(404).json({ message: 'Request not found' });
            }
        }

        // Check if the total_amount is provided and not negative
        if ('total_amount' in updates && updates.total_amount < 0) {
            return res.status(400).json({ message: 'Total amount cannot be negative.' });
        }

        const invoice = await Invoice.findByIdAndUpdate(id, updates, { new: true });
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an Invoice by ID
const deleteInvoiceById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid invoice ID format' });
    }

    try {
        const invoice = await Invoice.findByIdAndDelete(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json({ message: 'Invoice deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createInvoice,
    getInvoiceById,
    getAllInvoices,
    updateInvoiceById,
    deleteInvoiceById,
    getInvoiceByRequestId,
};

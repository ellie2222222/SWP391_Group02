const mongoose = require('mongoose');
const Invoice = require('../models/invoiceModel');
const User = require('../models/userModel');
const Request = require('../models/requestModel');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new Invoice
const createInvoice = async (req, res) => {
    const { request_id, payment_method } = req.body;

    if (!isValidObjectId(request_id)) {
        return res.status(400).json({ message: 'Invalid request_id format' });
    }

    try {
        // Find the request by ID
        const request = await Request.findById(request_id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Extract the necessary information from the request
        const total_amount = request.total_amount;

        // Check if total_amount is valid
        if (total_amount < 0) {
            return res.status(400).json({ message: 'Total amount cannot be negative.' });
        }

        // Create the invoice
        const invoice = new Invoice({ request_id, payment_method, total_amount });
        await invoice.save();
        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json({ message: 'Unable to create invoice. Please try again later.' });
    }
};

// Get an Invoice by ID
const getInvoiceById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid invoice ID format' });
    }

    try {
        const invoice = await Invoice.findById(id).populate('jewelry_id');
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Invoices
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an Invoice by ID
const updateInvoiceById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!isValidObjectId(id) || ('request_id' in updates && !isValidObjectId(updates.request_id))) {
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
        res.status(400).json({ message: error.message });
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
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createInvoice,
    getInvoiceById,
    getAllInvoices,
    updateInvoiceById,
    deleteInvoiceById
};

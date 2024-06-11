const Invoice = require('../models/invoiceModel');
const User = require('../models/userModel');
const Jewelry = require('../models/jewelryModel');

// Create a new Invoice
const createInvoice = async (req, res) => {
    const { user_id, payment_method, jewelry_id, total_amount } = req.body;

    try {
        // Check if the user_id exists and has the role 'user'
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'user') {
            return res.status(400).json({ message: 'User does not have the appropriate role' });
        }

        // Check if the jewelry_id exists
        const jewelry = await Jewelry.findById(jewelry_id);
        if (!jewelry) {
            return res.status(404).json({ message: 'Jewelry not found' });
        }

        // Check if the total_amount is non-negative
        if (total_amount < 0) {
            return res.status(400).json({ message: 'Total amount cannot be negative.' });
        }

        // Create the invoice
        const invoice = await Invoice.create({ user_id, payment_method, jewelry_id, total_amount });
        res.status(201).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to create invoice. Please try again later.' });
    }
}

// Get an Invoice by ID
const getInvoiceById = async (req, res) => {
    const { id } = req.params;

    try {
        const invoice = await Invoice.findById(id).populate('user_id');
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
        const invoices = await Invoice.find().populate('user_id');
        res.json(invoices);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an Invoice by ID
const updateInvoiceById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Check if the user_id exists and has the role 'user'
        if ('user_id' in updates) {
            const { user_id } = updates;
            const user = await User.findById(user_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.role !== 'user') {
                return res.status(400).json({ message: 'User does not have the appropriate role' });
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
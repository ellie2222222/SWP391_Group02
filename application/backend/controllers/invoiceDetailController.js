const InvoiceDetail = require('../models/invoiceDetailModel');
const Invoice = require('../models/invoiceModel');
const Jewelry = require('../models/jewelryModel');

// Create a new InvoiceDetail
const createInvoiceDetail = async (req, res) => {
    const { invoice_id, product_id, quantity, price } = req.body;

    try {
        // Check if an InvoiceDetail already exists for this invoice
        // const existingInvoiceDetail = await InvoiceDetail.findOne({ invoice_id });
        // if (existingInvoiceDetail) {
        //     return res.status(400).json({ message: 'An invoice detail already exists for this invoice.' });
        // }

        // Check if the invoice_id exists
        const invoice = await Invoice.findById(invoice_id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Check if the product_id exists
        const product = await Jewelry.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const invoiceDetail = new InvoiceDetail({ invoice_id, product_id, quantity, price });
        await invoiceDetail.save();
        res.status(201).json(invoiceDetail);
    } catch (error) {
        res.status(400).json({ message: 'Unable to create invoice detail. Please try again later.' });
    }
};

// Get InvoiceDetails by Invoice ID
const getInvoiceDetailsByInvoiceId = async (req, res) => {
    const { invoice_id } = req.params;

    try {
        const invoiceDetails = await InvoiceDetail.find({ invoice_id }).populate('product_id');
        if (!invoiceDetails) {
            return res.status(404).json({ message: 'No invoice details found for this invoice.' });
        }
        res.json(invoiceDetails);
    } catch (error) {
        res.status(400).json({ message: 'Unable to fetch invoice details. Please try again later.' });
    }
};

// Update an InvoiceDetail by ID
const updateInvoiceDetailById = async (req, res) => {
    const { id } = req.params;
    const { product_id, quantity, price } = req.body;

    try {
        // Check if the invoice detail exists
        const invoiceDetail = await InvoiceDetail.findById(id);
        if (!invoiceDetail) {
            return res.status(404).json({ message: 'Invoice detail not found. Please provide a valid invoice detail ID.' });
        }

        // Check if the product_id exists
        const product = await Jewelry.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the fields
        if (product_id !== undefined) invoiceDetail.quantity = quantity;
        if (quantity !== undefined) invoiceDetail.quantity = quantity;
        if (price !== undefined) invoiceDetail.price = price;

        await invoiceDetail.save();
        res.json(invoiceDetail);
    } catch (error) {
        res.status(400).json({ message: 'Unable to update invoice detail. Please try again later.' });
    }
};

// Delete an InvoiceDetail by ID
const deleteInvoiceDetailById = async (req, res) => {
    const { id } = req.params;

    try {
        const invoiceDetail = await InvoiceDetail.findByIdAndDelete(id);
        if (!invoiceDetail) {
            return res.status(404).json({ message: 'Invoice detail not found.' });
        }
        res.json({ message: 'Invoice detail successfully deleted.' });
    } catch (error) {
        res.status(400).json({ message: 'Unable to delete invoice detail. Please try again later.' });
    }
};

module.exports = {
    createInvoiceDetail,
    getInvoiceDetailsByInvoiceId,
    updateInvoiceDetailById,
    deleteInvoiceDetailById
};
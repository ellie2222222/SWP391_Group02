const express = require('express');
const {createInvoice, getInvoiceById, getAllInvoices, updateInvoiceById, deleteInvoiceById} = require('../controllers/invoiceController');
const requireAuth = require('../middleware/requireAuth');
const { requireManager } = require('../middleware/requireRoles');
const { requireManagerOrSale } = require('../middleware/requireRoles');

const invoiceRoutes = express.Router();

// Route to create a new Invoice
invoiceRoutes.post('/createInvoice', requireAuth, requireManagerOrSale, createInvoice);

// Route to get an Invoice by ID
invoiceRoutes.get('/getInvoice/:id', requireAuth, getInvoiceById);

// Route to get all Invoices
invoiceRoutes.get('/getInvoices', requireAuth, requireManager, getAllInvoices);

// Route to update an Invoice by ID
invoiceRoutes.patch('/updateInvoice/:id', requireAuth, requireManager, updateInvoiceById);

// Route to delete an Invoice by ID
invoiceRoutes.delete('/deleteInvoiceBy/:id', requireAuth, requireManager, deleteInvoiceById);

module.exports = invoiceRoutes;
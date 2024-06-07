const express = require('express');
const { createInvoiceDetail, getInvoiceDetailsByInvoiceId, updateInvoiceDetailById, deleteInvoiceDetailById } = require('../controllers/invoiceDetailController');
const requireAuth = require('../middleware/requireAuth');
const { requireManager } = require('../middleware/requireRoles');
const { requireManagerOrSale } = require('../middleware/requireRoles');

const invoiceDetialRoutes = express.Router();

// Route to create a new InvoiceDetail
invoiceDetialRoutes.post('/createInvoiceDetail', requireAuth, requireManagerOrSale, createInvoiceDetail);

// Route to get InvoiceDetails by Invoice ID
invoiceDetialRoutes.get('/getInvoiceDetail/:invoice_id', requireAuth, getInvoiceDetailsByInvoiceId);

// Route to update an InvoiceDetail by ID
invoiceDetialRoutes.patch('/updateInvoiceDetail/:id', requireAuth, requireManagerOrSale, updateInvoiceDetailById);

// Route to delete an InvoiceDetail by ID
invoiceDetialRoutes.delete('/deleteInvoiceDetail/:id', requireAuth, requireManager, deleteInvoiceDetailById);

module.exports = invoiceDetialRoutes;
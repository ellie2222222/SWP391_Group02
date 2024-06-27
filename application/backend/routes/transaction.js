const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { createTransaction, getTransactionById } = require('../controllers/transactionController')

const transactionRoutes = express.Router()

transactionRoutes.use(requireAuth)

transactionRoutes.post('/', createTransaction)

transactionRoutes.get('/transactions/:id', getTransactionById);

module.exports = transactionRoutes
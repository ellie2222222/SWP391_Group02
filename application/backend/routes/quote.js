const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { requireSales, requireManager, requireManagerOrSale } = require('../middleware/requireRoles')
const { getQuotes, getQuote, createQuote, updateQuoteStatus } = require('../controllers/quoteController')

const quoteRoutes = express.Router()

quoteRoutes.use(requireAuth)

quoteRoutes.post('/createQuote', requireSales, createQuote)

quoteRoutes.get('/getQuotes', requireManager, getQuotes)

quoteRoutes.get('/getQuote/:id', requireManagerOrSale, getQuote)

quoteRoutes.patch('/updateQuoteStatus/:id', requireManager, updateQuoteStatus)

module.exports = quoteRoutes
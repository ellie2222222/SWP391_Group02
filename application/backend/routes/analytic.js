const express = require("express");
const { getCompletedRequests, getCurrentTotalRevenue, getMonthlyRevenue, getDailyRevenue, getQuarterlyRevenue, getTotalRevenue, getRecentInvoices, getAllCustomers } = require("../controllers/analyticController");
const requireAuth = require('../middleware/requireAuth');
const { requireManager } = require('../middleware/requireRoles');

const analyticRoutes = express.Router();

analyticRoutes.use(requireAuth)

// Route to get analytics
// analyticRoutes.get("/revenue", requireManager, getCurrentTotalRevenue);  

analyticRoutes.get("/total-revenue", requireManager, getTotalRevenue);

analyticRoutes.get("/monthly-revenue", requireManager, getMonthlyRevenue);

analyticRoutes.get("/daily-revenue", requireManager, getDailyRevenue);

analyticRoutes.get("/quarterly-revenue", requireManager, getQuarterlyRevenue);

analyticRoutes.get("/recent-invoices", requireManager, getRecentInvoices);

analyticRoutes.get("/completed-requests", requireManager, getCompletedRequests);

analyticRoutes.get("/all-customers", requireManager, getAllCustomers);

module.exports = analyticRoutes;

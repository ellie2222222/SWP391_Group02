const express = require("express");
const { getCompletedRequests, getCurrentTotalRevenue, getMonthlyRevenue, getDailyRevenue, getQuarterlyRevenue, getTotalRevenue, getRecentInvoices, getAllCustomers, getEmployeeWithMostSales, getTopSellingGemstones, getTopSellingMaterials, getTopSellingJewelry } = require("../controllers/analyticController");
const requireAuth = require('../middleware/requireAuth');
const { requireManager } = require('../middleware/requireRoles');

const analyticRoutes = express.Router();

analyticRoutes.use(requireAuth)

// Route to get analytics

analyticRoutes.get("/top-selling-gemstones", requireManager, getTopSellingGemstones);  

analyticRoutes.get("/top-selling-materials", requireManager, getTopSellingMaterials);  

analyticRoutes.get("/top-selling-jewelry-sample", requireManager, getTopSellingJewelry); 

analyticRoutes.get("/top-sales-employee", requireManager, getEmployeeWithMostSales);  

analyticRoutes.get("/current-revenue", requireManager, getCurrentTotalRevenue);  

analyticRoutes.get("/total-revenue", requireManager, getTotalRevenue);

analyticRoutes.get("/monthly-revenue", requireManager, getMonthlyRevenue);

analyticRoutes.get("/daily-revenue", requireManager, getDailyRevenue);

analyticRoutes.get("/quarterly-revenue", requireManager, getQuarterlyRevenue);

analyticRoutes.get("/recent-invoices", requireManager, getRecentInvoices);

analyticRoutes.get("/completed-requests", requireManager, getCompletedRequests);

analyticRoutes.get("/all-customers", requireManager, getAllCustomers);

module.exports = analyticRoutes;

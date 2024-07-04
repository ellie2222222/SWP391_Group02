const express = require("express");
const { getTotalRevenue, getCompletedRequests } = require("../controllers/analyticController");
const requireAuth = require('../middleware/requireAuth');
const { requireManager } = require('../middleware/requireRoles');

const analyticRoutes = express.Router();

analyticRoutes.use(requireAuth)

// Route to get analytics
analyticRoutes.get("/revenue", requireManager, getTotalRevenue);

analyticRoutes.get("/completed-requests", requireManager, getTotalRevenue);

module.exports = analyticRoutes;

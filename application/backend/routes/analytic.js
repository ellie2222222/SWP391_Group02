const express = require("express");
const { getTotalRevenue, getCompletedRequests } = require("../controllers/analyticController");
const requireAuth = require('../middleware/requireAuth');
const { requireManager } = require('../middleware/requireRoles');

const router = express.Router();
requestRoutes.use(requireAuth)
// Route to get analytics
router.get("/revenue", requireManager, getTotalRevenue);
router.get("/completed-requests", requireManager, getTotalRevenue);
module.exports = router;

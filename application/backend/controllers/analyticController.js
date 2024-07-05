const Invoice = require('../models/invoiceModel');
const Request = require('../models/requestModel');

// Helper function to get date range
const getDateRange = (period) => {
    const now = new Date();
    let start, end;
    switch (period) {
        case 'month':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            break;
        case 'quarter':
            const quarter = Math.floor(now.getMonth() / 3);
            start = new Date(now.getFullYear(), quarter * 3, 1);
            end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59);
            break;
        case 'year':
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
            break;
        default:
            throw new Error('Invalid period specified');
    }
    return { start, end };
};

// Function to get total revenue
const getTotalRevenue = async (req, res) => {
    const { period } = req.query;

    const { start, end } = getDateRange(period);
    console.log(start)
    console.log(end)

    try {
        const invoices = await Invoice.find({
            createdAt: { $gte: start, $lt: end },
        });
        // console.log(invoices)
        const totalRevenue = invoices.reduce((total, invoice) => total + invoice.total_amount, 0);

        res.json({ totalRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating total revenue', error });
    }
};

// Function to get completed requests
const getCompletedRequests = async (req, res) => {
    const { period } = req.query;

    const { start, end } = getDateRange(period);

    try {
        const requests = await Request.find({
            createdAt: { $gte: start, $lt: end },
            status: 'completed'
        });

        const totalCompletedRequests = requests.length;

        res.json({ totalCompletedRequests });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating completed requests', error });
    }
};

module.exports = {
    getTotalRevenue,
    getCompletedRequests,
};

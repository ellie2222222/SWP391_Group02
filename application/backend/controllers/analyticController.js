const Invoice = require('../models/invoiceModel');
const Request = require('../models/requestModel');
const User = require('../models/userModel');

// Helper function to get date range
// const getDateRange = (period) => {
//     const now = new Date();
//     let start, end;
//     switch (period) {
//         case 'month':
//             start = new Date(now.getFullYear(), now.getMonth(), 1);
//             end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
//             break;
//         case 'quarter':
//             const quarter = Math.floor(now.getMonth() / 3);
//             start = new Date(now.getFullYear(), quarter * 3, 1);
//             end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59);
//             break;
//         case 'year':
//             start = new Date(now.getFullYear(), 0, 1);
//             end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
//             break;
//         default:
//             throw new Error('Invalid period specified');
//     }
//     return { start, end };
// };

// Function to get total revenue
// const getCurrentTotalRevenue = async (req, res) => {
//     const { period } = req.query;

//     const { start, end } = getDateRange(period);
//     console.log(start)
//     console.log(end)

//     try {
//         const invoices = await Invoice.find({
//             createdAt: { $gte: start, $lt: end },
//         });
//         // console.log(invoices)
//         const totalRevenue = invoices.reduce((total, invoice) => total + invoice.total_amount, 0);

//         res.json({ totalRevenue });
//     } catch (error) {
//         res.status(500).json({ message: 'Error calculating total revenue', error });
//     }
// };

const getTotalRevenue = async (req, res) => {
    try {
        const invoices = await Invoice.find({});

        const totalRevenue = invoices.reduce((total, invoice) => total + invoice.total_amount, 0);

        res.json({ totalRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating total revenue', error });
    }
}

const getMonthlyRevenue = async (req, res) => {
    const { period, yearValue } = req.query;

    if (period !== 'year' || !yearValue) {
        res.status(400).json({ message: 'Invalid period or yearValue not specified' });
        return;
    }

    const year = parseInt(yearValue, 10);
    if (isNaN(year)) {
        res.status(400).json({ message: 'Invalid yearValue specified' });
        return;
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    try {
        let totalRevenue = 0;
        const monthlyRevenue = await Promise.all(months.map(async (month, index) => {
            const start = new Date(year, index, 1);
            const end = new Date(year, index + 1, 0, 23, 59, 59);

            const invoices = await Invoice.find({
                createdAt: { $gte: start, $lt: end },
            });

            const monthTotalRevenue = invoices.reduce((total, invoice) => total + invoice.total_amount, 0);
            totalRevenue += monthTotalRevenue;

            return { x: month, y: monthTotalRevenue };
        }));

        res.json({ data: monthlyRevenue, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating monthly revenue', error });
    }
};

const getDailyRevenue = async (req, res) => {
    const { period, monthValue, yearValue } = req.query;

    if (period !== 'month' || !monthValue || !yearValue) {
        res.status(400).json({ message: 'Invalid period or monthValue/yearValue not specified' });
        return;
    }

    const month = parseInt(monthValue, 10) - 1; // JavaScript months are 0-based
    const year = parseInt(yearValue, 10);
    if (isNaN(month) || isNaN(year) || month < 0 || month > 11) {
        res.status(400).json({ message: 'Invalid monthValue or yearValue specified' });
        return;
    }

    try {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let totalRevenue = 0;
        const dailyRevenue = await Promise.all([...Array(daysInMonth).keys()].map(async (day) => {
            const start = new Date(year, month, day + 1);
            const end = new Date(year, month, day + 1, 23, 59, 59);

            const invoices = await Invoice.find({
                createdAt: { $gte: start, $lt: end },
            });

            const dayTotalRevenue = invoices.reduce((total, invoice) => total + invoice.total_amount, 0);
            totalRevenue += dayTotalRevenue;

            return { x: day + 1, y: dayTotalRevenue };
        }));

        res.json({ data: dailyRevenue, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating daily revenue', error });
    }
};

const getQuarterlyRevenue = async (req, res) => {
    const { period, quarterValue, yearValue } = req.query;

    if (period !== 'quarter' || !quarterValue || !yearValue) {
        res.status(400).json({ message: 'Invalid period or quarterValue/yearValue not specified' });
        return;
    }

    const quarter = parseInt(quarterValue, 10);
    const year = parseInt(yearValue, 10);
    if (isNaN(quarter) || isNaN(year) || quarter < 1 || quarter > 4) {
        res.status(400).json({ message: 'Invalid quarterValue or yearValue specified' });
        return;
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 3;

    try {
        let totalQuarterlyRevenue = 0;
        const quarterlyRevenue = await Promise.all([...Array(3).keys()].map(async (index) => {
            const monthIndex = startMonth + index;
            const start = new Date(year, monthIndex, 1);
            const end = new Date(year, monthIndex + 1, 0, 23, 59, 59);

            const invoices = await Invoice.find({
                createdAt: { $gte: start, $lt: end },
            });

            const monthlyRevenue = invoices.reduce((total, invoice) => total + invoice.total_amount, 0);
            totalQuarterlyRevenue += monthlyRevenue;

            return { x: months[monthIndex], y: monthlyRevenue };
        }));

        res.json({ data: quarterlyRevenue, totalRevenue: totalQuarterlyRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating quarterly revenue', error });
    }
};

const getRecentInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .populate({
            path: 'transaction_id',
            populate: {
                path: 'request_id',
                populate: {
                    path: 'user_id',
                    select: '-password',
                }
            }
        })
        .exec();

        res.json({ invoices });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoices', error });
    }
};

// Function to get completed requests
const getCompletedRequests = async (req, res) => {
    try {
        const requests = await Request.find({});
        const totalCompletedRequests = requests.length;

        res.json({ totalCompletedRequests });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating completed requests', error });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" });
        const customers = users.length;

        res.json({ customers });
    } catch (error) {
        res.status(500).json({ message: 'Error getting all customers', error });
    }
}

module.exports = {
    getCompletedRequests,
    getMonthlyRevenue,
    getDailyRevenue,
    getQuarterlyRevenue,
    getTotalRevenue,
    getRecentInvoices,
    getAllCustomers,
};

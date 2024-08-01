const Invoice = require('../models/invoiceModel');
const Transaction = require('../models/transactionModel');
const Request = require('../models/requestModel');
const Jewelry = require('../models/jewelryModel');
const Gemstone = require('../models/gemstoneModel');
const Material = require('../models/materialModel');
const User = require('../models/userModel');

const getEmployeeWithMostSales = async (req, res) => {
    const { period, monthValue, yearValue } = req.query;

    let matchStage = {
        'worksOn.staff_ids.role': { $nin: ['manager', 'design_staff', 'production_staff'] },
        'request.request_status': 'completed'
    };

    if (period === 'month') {
        matchStage['invoices.createdAt'] = {
            $gte: new Date(Date.UTC(yearValue, monthValue - 1, 1)),
            $lt: new Date(Date.UTC(yearValue, monthValue, 0, 23, 59, 59, 999))
        };
    } else if (period === 'year') {
        matchStage['invoices.createdAt'] = {
            $gte: new Date(Date.UTC(yearValue, 0, 1)),
            $lt: new Date(Date.UTC(yearValue, 12, 0, 23, 59, 59, 999)),
        };
    }

    try {
        const salesData = await Transaction.aggregate([
            {
                $lookup: {
                    from: 'worksons',
                    localField: 'request_id',
                    foreignField: 'request_id',
                    as: 'worksOn'
                }
            },
            { $unwind: '$worksOn' },
            { $unwind: '$worksOn.staff_ids' },
            { $lookup: { from: 'requests', localField: 'request_id', foreignField: '_id', as: 'request' } },
            { $unwind: '$request' },
            { $lookup: { from: 'invoices', localField: '_id', foreignField: 'transaction_id', as: 'invoices' } },
            { $unwind: '$invoices' },
            { $match: matchStage },
            {
                $group: {
                    _id: '$worksOn.staff_ids.staff_id',
                    totalSales: { $sum: '$invoices.total_amount' }
                },
            },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 1,
                    userName: '$user.username',
                    email: '$user.email',
                    role: '$user.role',
                    totalSales: 1
                }
            },
            { $sort: { totalSales: -1 } },
            { $limit: 1 }
        ]);
        
        if (salesData.length > 0) {
            const [topSeller] = salesData;
            return res.json({ topSeller });
        } else {
            return res.json({ message: 'No sales data available' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Helper function to get date range
const getDateRange = (period, offset = 0) => {
    const now = new Date();
    let start, end;
    switch (period) {
        case 'month':
            start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
            end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1 + offset, 0, 23, 59, 59, 999));
            break;
        case 'quarter':
            const quarter = Math.floor((now.getUTCMonth() + offset * 3) / 3);
            start = new Date(Date.UTC(now.getUTCFullYear(), quarter * 3, 1));
            end = new Date(Date.UTC(now.getUTCFullYear(), (quarter + 1) * 3, 0, 23, 59, 59, 999));
            break;
        case 'year':
            start = new Date(Date.UTC(now.getUTCFullYear() + offset, 0, 1));
            end = new Date(Date.UTC(now.getUTCFullYear() + offset, 11, 31, 23, 59, 59, 999));
            break;
        default:
            throw new Error('Invalid period specified');
    }
    return { start, end };
};

// Function to get current total revenue
const getCurrentTotalRevenue = async (req, res) => {
    const { period } = req.query;

    try {
        const { start, end } = getDateRange(period);
        const previousPeriod = period === 'month' ? 'month' : period === 'quarter' ? 'quarter' : 'year';

        const invoicesCurrent = await Invoice.aggregate([
            {
                $lookup: {
                    from: 'transactions',
                    localField: 'transaction_id',
                    foreignField: '_id',
                    as: 'transaction'
                }
            },
            { $unwind: '$transaction' },
            {
                $lookup: {
                    from: 'requests',
                    localField: 'transaction.request_id',
                    foreignField: '_id',
                    as: 'request'
                }
            },
            { $unwind: '$request' },
            {
                $match: {
                    'request.request_status': 'completed',
                    'createdAt': { $gte: start, $lt: end }
                }
            }
        ]);

        const totalRevenueCurrent = invoicesCurrent.reduce((total, invoice) => total + invoice.total_amount, 0);

        const { start: startPrevious, end: endPrevious } = getDateRange(previousPeriod, -1);

        const invoicesPrevious = await Invoice.aggregate([
            {
                $lookup: {
                    from: 'transactions',
                    localField: 'transaction_id',
                    foreignField: '_id',
                    as: 'transaction'
                }
            },
            { $unwind: '$transaction' },
            {
                $lookup: {
                    from: 'requests',
                    localField: 'transaction.request_id',
                    foreignField: '_id',
                    as: 'request'
                }
            },
            { $unwind: '$request' },
            {
                $match: {
                    'request.request_status': 'completed',
                    'createdAt': { $gte: startPrevious, $lt: endPrevious }
                }
            }
        ]);

        const totalRevenuePrevious = invoicesPrevious.reduce((total, invoice) => total + invoice.total_amount, 0);

        const growthPercent = totalRevenuePrevious === 0
            ? (totalRevenueCurrent === 0 ? 0 : 100)
            : ((totalRevenueCurrent - totalRevenuePrevious) / totalRevenuePrevious) * 100;

        return res.json({ 
            totalRevenueCurrent,
            totalRevenuePrevious,
            growthPercent: growthPercent.toFixed(2) // Rounded to 2 decimal places
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Function to get total revenue
const getTotalRevenue = async (req, res) => {
    try {
        const invoices = await Invoice.aggregate([
            {
                $lookup: {
                    from: 'transactions',
                    localField: 'transaction_id',
                    foreignField: '_id',
                    as: 'transaction'
                }
            },
            { $unwind: '$transaction' },
            {
                $lookup: {
                    from: 'requests',
                    localField: 'transaction.request_id',
                    foreignField: '_id',
                    as: 'request'
                }
            },
            { $unwind: '$request' },
            {
                $match: {
                    'request.request_status': 'completed'
                }
            }
        ]);

        const totalRevenue = invoices.reduce((total, invoice) => total + invoice.total_amount, 0);

        return res.json({ totalRevenue });
    } catch (error) {
        return res.status(500).json({ message: 'Error calculating total revenue', error });
    }
};

// Function to get monthly revenue
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

            const invoices = await Invoice.aggregate([
                {
                    $lookup: {
                        from: 'transactions',
                        localField: 'transaction_id',
                        foreignField: '_id',
                        as: 'transaction'
                    }
                },
                { $unwind: '$transaction' },
                {
                    $lookup: {
                        from: 'requests',
                        localField: 'transaction.request_id',
                        foreignField: '_id',
                        as: 'request'
                    }
                },
                { $unwind: '$request' },
                {
                    $match: {
                        'request.request_status': 'completed',
                        'createdAt': { $gte: start, $lt: end }
                    }
                }
            ]);

            const monthTotalRevenue = invoices.reduce((total, invoice) => total + invoice.total_amount, 0);
            totalRevenue += monthTotalRevenue;

            return { x: month, y: monthTotalRevenue };
        }));

        return res.json({ data: monthlyRevenue, totalRevenue });
    } catch (error) {
        return res.status(500).json({ message: 'Error calculating monthly revenue', error });
    }
};

// Function to get daily revenue
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

            const invoices = await Invoice.aggregate([
                {
                    $lookup: {
                        from: 'transactions',
                        localField: 'transaction_id',
                        foreignField: '_id',
                        as: 'transaction'
                    }
                },
                { $unwind: '$transaction' },
                {
                    $lookup: {
                        from: 'requests',
                        localField: 'transaction.request_id',
                        foreignField: '_id',
                        as: 'request'
                    }
                },
                { $unwind: '$request' },
                {
                    $match: {
                        'request.request_status': 'completed',
                        'createdAt': { $gte: start, $lt: end }
                    }
                }
            ]);

            const dayTotalRevenue = invoices.reduce((total, invoice) => total + invoice.total_amount, 0);
            totalRevenue += dayTotalRevenue;

            return { x: day + 1, y: dayTotalRevenue };
        }));

        return res.json({ data: dailyRevenue, totalRevenue });
    } catch (error) {
        return  res.status(500).json({ message: 'Error calculating daily revenue', error });
    }
};

// Function to get quarterly revenue
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

            const invoices = await Invoice.aggregate([
                {
                    $lookup: {
                        from: 'transactions',
                        localField: 'transaction_id',
                        foreignField: '_id',
                        as: 'transaction'
                    }
                },
                { $unwind: '$transaction' },
                {
                    $lookup: {
                        from: 'requests',
                        localField: 'transaction.request_id',
                        foreignField: '_id',
                        as: 'request'
                    }
                },
                { $unwind: '$request' },
                {
                    $match: {
                        'request.request_status': 'completed',
                        'createdAt': { $gte: start, $lt: end }
                    }
                }
            ]);

            const monthlyRevenue = invoices.reduce((total, invoice) => total + invoice.total_amount, 0);
            totalQuarterlyRevenue += monthlyRevenue;

            return { x: months[monthIndex], y: monthlyRevenue };
        }));

        return res.json({ data: quarterlyRevenue, totalRevenue: totalQuarterlyRevenue });
    } catch (error) {
        return res.status(500).json({ message: 'Error calculating quarterly revenue', error });
    }
};

// Function to get recent invoices
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

        return res.json({ invoices });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching invoices', error });
    }
};

// Function to get completed requests
const getCompletedRequests = async (req, res) => {
    try {
        const requests = await Request.find({ request_status: 'completed' });
        const totalCompletedRequests = requests.length;

        return res.json({ totalCompletedRequests });
    } catch (error) {
        return  res.status(500).json({ message: 'Error calculating completed requests', error });
    }
};

// Function to get all customers
const getAllCustomers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" });
        const customers = users.length;

        return res.json({ customers });
    } catch (error) {
        return res.status(500).json({ message: 'Error getting all customers', error });
    }
}

const getTopSellingMaterials = async (req, res) => {
    try {
        const topMaterials = await Request.aggregate([
            { $match: { request_status: 'completed' } },
            {
                $lookup: {
                    from: 'jewelries',
                    localField: 'jewelry_id',
                    foreignField: '_id',
                    as: 'jewelry'
                }
            },
            { $unwind: '$jewelry' },
            {
                $lookup: {
                    from: 'materials',
                    localField: 'jewelry.material_id',
                    foreignField: '_id',
                    as: 'material'
                }
            },
            { $unwind: '$material' },
            {
                $group: {
                    _id: '$material.name',
                    count: { $sum: 1 },
                }
            },
            { 
                $project: {
                    _id: 0,
                    material: '$_id',
                    sales: '$count'
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        return res.json({ topMaterials });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching top 10 materials' });
    }
};

const getCategoryCounts = async (req, res) => {
    try {
        const jewelryCategories = await Jewelry.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    value: '$count',
                }
            }
        ]);

        return res.json({ jewelryCategories });
    } catch (error) {
        return res.json({ error: 'Error fetching categories of jewelry' })
    }
};

module.exports = {
    getCompletedRequests,   
    getMonthlyRevenue,
    getDailyRevenue,
    getQuarterlyRevenue,
    getTotalRevenue,
    getRecentInvoices,
    getAllCustomers,
    getCurrentTotalRevenue,
    getEmployeeWithMostSales,
    getTopSellingMaterials,
    getCategoryCounts,
};

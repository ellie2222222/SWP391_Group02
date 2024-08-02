const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id, role } = jwt.verify(token, process.env.SECRET);

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        req.role = role;
        req.id = _id;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Request is not authorized' });
    }
};

module.exports = requireAuth;
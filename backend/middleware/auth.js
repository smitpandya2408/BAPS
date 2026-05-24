const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Invalid or inactive user.' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

// Check specific permission
const checkPermission = (permission) => {
    return (req, res, next) => {
        if (req.user.role === 'admin') return next(); // Admin has all permissions
        if (!req.user.permissions[permission]) {
            return res.status(403).json({ message: `You do not have permission to ${permission}.` });
        }
        next();
    };
};

module.exports = { authenticate, isAdmin, checkPermission };

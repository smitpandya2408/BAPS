const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.isActive) {
            return res.status(401).json({ message: 'Your account has been deactivated. Contact administrator.' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                permissions: user.role === 'admin'
                    ? { canView: true, canAdd: true, canEdit: true, canDelete: true }
                    : user.permissions,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// For initial setup (create first admin user if none exists)
router.post('/register', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            return res.status(403).json({ message: 'Registration closed. Ask an admin to create your account.' });
        }
        const { email, password } = req.body;
        const user = new User({
            email,
            password,
            role: 'admin',
            permissions: { canView: true, canAdd: true, canEdit: true, canDelete: true },
        });
        await user.save();
        res.status(201).json({ message: 'Admin user created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

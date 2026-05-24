const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new user (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
    try {
        const { email, password, name, role, permissions } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const user = new User({
            email,
            password,
            name: name || '',
            role: role || 'user',
            permissions: role === 'admin'
                ? { canView: true, canAdd: true, canEdit: true, canDelete: true }
                : permissions || { canView: true, canAdd: false, canEdit: false, canDelete: false },
        });

        await user.save();

        const savedUser = await User.findById(user._id).select('-password');
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, email, role, permissions, isActive, password } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent admin from deactivating themselves
        if (req.user._id.toString() === req.params.id && isActive === false) {
            return res.status(400).json({ message: 'You cannot deactivate your own account.' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.isActive = isActive !== undefined ? isActive : user.isActive;

        if (role === 'admin') {
            user.permissions = { canView: true, canAdd: true, canEdit: true, canDelete: true };
        } else if (permissions) {
            user.permissions = permissions;
        }

        if (password && password.trim() !== '') {
            user.password = password;
        }

        await user.save();

        const updatedUser = await User.findById(user._id).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: 'You cannot delete your own account.' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

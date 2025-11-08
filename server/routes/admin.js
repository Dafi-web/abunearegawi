const express = require('express');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { adminAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ isMember: true });
    const totalUsers = await User.countDocuments();
    const totalDonations = await Payment.aggregate([
      { $match: { type: 'donation', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          type: 'subscription',
          status: 'completed',
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      totalMembers,
      totalUsers,
      totalDonations: totalDonations[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with optional search
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a user
router.put(
  '/users/:id',
  adminAuth,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role')
      .optional()
      .isIn(['admin', 'member', 'user'])
      .withMessage('Invalid role'),
    body('isMember').isBoolean().withMessage('isMember must be a boolean'),
    body('subscriptionStatus')
      .optional({ nullable: true })
      .isIn(['active', 'canceled', 'past_due', 'incomplete', ''])
      .withMessage('Invalid subscription status'),
    body('memberSince')
      .optional({ nullable: true })
      .custom((value) => {
        if (!value) return true;
        const date = new Date(value);
        return !isNaN(date.getTime());
      })
      .withMessage('memberSince must be a valid date'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { name, email, role, isMember, subscriptionStatus, memberSince } = req.body;

      const existingWithEmail = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (existingWithEmail) {
        return res.status(400).json({ message: 'Email is already in use by another user' });
      }

      user.name = name;
      user.email = email.toLowerCase();

      if (role) {
        user.role = role;
      }

      user.isMember = isMember;

      if (isMember) {
        if (memberSince) {
          user.memberSince = new Date(memberSince);
        } else if (!user.memberSince) {
          user.memberSince = new Date();
        }
        if (subscriptionStatus && subscriptionStatus.length > 0) {
          user.subscriptionStatus = subscriptionStatus;
        } else if (!user.subscriptionStatus) {
          user.subscriptionStatus = 'active';
        }
      } else {
        user.memberSince = null;
        user.subscriptionStatus = null;
        user.stripeSubscriptionId = null;
      }

      await user.save();

      const sanitized = user.toObject();
      delete sanitized.password;

      res.json(sanitized);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'At least one admin user must remain.' });
      }
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;









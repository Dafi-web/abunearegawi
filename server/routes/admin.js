const express = require('express');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { adminAuth } = require('../middleware/auth');

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

module.exports = router;



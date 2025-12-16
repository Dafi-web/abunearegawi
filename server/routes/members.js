const express = require('express');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all members (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const members = await User.find({ isMember: true })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get member payment status
router.get('/:id/payments', adminAuth, async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.params.id,
      type: 'subscription',
    }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment status for current month/year
router.get('/payments/status', adminAuth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const members = await User.find({ isMember: true });
    const status = await Promise.all(
      members.map(async (member) => {
        const payment = await Payment.findOne({
          user: member._id,
          type: 'subscription',
          month: parseInt(currentMonth),
          year: parseInt(currentYear),
          status: 'completed',
        });

        return {
          member: {
            id: member._id,
            name: member.name,
            email: member.email,
          },
          paid: !!payment,
          paymentDate: payment ? payment.createdAt : null,
          subscriptionStatus: member.subscriptionStatus,
        };
      })
    );

    res.json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;












const express = require('express');
const User = require('../models/User');
const { adminAuth, auth } = require('../middleware/auth');

const router = express.Router();

// Send notification to user (admin only)
router.post('/send', adminAuth, async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications.push({
      message,
      type: type || 'general',
    });
    await user.save();

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send payment reminder to member (admin only)
router.post('/payment-reminder', adminAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    
    if (!user || !user.isMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    user.notifications.push({
      message: 'This is a reminder that your monthly membership payment is due. Please make your payment to continue your membership.',
      type: 'payment_reminder',
    });
    await user.save();

    res.json({ message: 'Payment reminder sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send reminder to all unpaid members
router.post('/remind-all-unpaid', adminAuth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const members = await User.find({ isMember: true });
    const Payment = require('../models/Payment');

    let remindedCount = 0;
    for (const member of members) {
      const payment = await Payment.findOne({
        user: member._id,
        type: 'subscription',
        month: parseInt(currentMonth),
        year: parseInt(currentYear),
        status: 'completed',
      });

      if (!payment) {
        member.notifications.push({
          message: 'This is a reminder that your monthly membership payment is due. Please make your payment to continue your membership.',
          type: 'payment_reminder',
        });
        await member.save();
        remindedCount++;
      }
    }

    res.json({ message: `Reminders sent to ${remindedCount} members` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user notifications
router.get('/my-notifications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.notifications || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const notification = user.notifications.id(req.params.notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await user.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.notifications.forEach(notification => {
      notification.read = true;
    });
    await user.save();

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;











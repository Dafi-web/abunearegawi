const cron = require('node-cron');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { sendPaymentReminderEmail } = require('./email');

// Track which users have been reminded to avoid duplicates
const remindedUsers = new Map();

// Function to check and send payment reminders
const checkAndSendPaymentReminders = async () => {
  try {
    console.log('Checking for payments due in 2 days...');
    
    // Calculate the date 2 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const targetMonth = targetDate.getMonth() + 1; // Month is 1-12
    const targetYear = targetDate.getFullYear();

    // Find all active members
    const members = await User.find({ 
      isMember: true,
      subscriptionStatus: { $in: ['active', null] }
    });

    let remindersSent = 0;
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    for (const member of members) {
      try {
        // Check if user already received a reminder today
        const reminderKey = `${member._id.toString()}-${todayKey}`;
        if (remindedUsers.has(reminderKey)) {
          continue;
        }

        // Check if payment for target month/year already exists
        const existingPayment = await Payment.findOne({
          user: member._id,
          type: 'subscription',
          month: targetMonth,
          year: targetYear,
          status: 'completed',
        });

        // If payment doesn't exist, check if due date is 2 days away
        if (!existingPayment) {
          // Calculate member's subscription due date
          // For monthly subscriptions, the due date is typically the same day each month
          let dueDate;
          
          if (member.memberSince) {
            const memberSince = new Date(member.memberSince);
            // Calculate next due date in target month
            const dayOfMonth = memberSince.getDate();
            dueDate = new Date(targetYear, targetMonth - 1, dayOfMonth);
            
            // If the day doesn't exist in target month (e.g., Jan 31 -> Feb 31), use last day of month
            if (dueDate.getMonth() !== targetMonth - 1) {
              dueDate = new Date(targetYear, targetMonth, 0); // Last day of target month
            }
          } else {
            // Default to first of the month if no memberSince date
            dueDate = new Date(targetYear, targetMonth - 1, 1);
          }

          // Calculate days until due date
          const timeDiff = dueDate.getTime() - now.getTime();
          const daysDifference = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          
          // Send reminder if due date is exactly 2 days away (allow 1-3 day window for flexibility)
          if (daysDifference >= 1 && daysDifference <= 3) {
            const daysToShow = daysDifference === 1 ? 1 : daysDifference === 2 ? 2 : 3;
            
            // Send email reminder
            const emailResult = await sendPaymentReminderEmail(member, daysToShow);
            
            if (emailResult.success) {
              // Add notification to user's account (for record keeping, though not visible in UI)
              member.notifications.push({
                message: `Payment reminder sent via email. Your membership payment of €10 is due in ${daysToShow} day${daysToShow > 1 ? 's' : ''}.`,
                type: 'payment_reminder',
              });
              await member.save();
              
              // Mark as reminded today
              remindedUsers.set(reminderKey, true);
              remindersSent++;
              console.log(`Payment reminder email sent to ${member.email} (due in ${daysToShow} day${daysToShow > 1 ? 's' : ''})`);
            } else {
              console.error(`Failed to send email to ${member.email}:`, emailResult.error || emailResult.message);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing member ${member.email}:`, error);
      }
    }

    // Clean up old reminder keys (keep only last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    for (const [key] of remindedUsers) {
      const [userId, dateStr] = key.split('-');
      const keyDate = new Date(dateStr.replace(/-/g, '/'));
      if (keyDate < sevenDaysAgo) {
        remindedUsers.delete(key);
      }
    }

    console.log(`Payment reminder check completed. ${remindersSent} reminder(s) sent.`);
  } catch (error) {
    console.error('Error in payment reminder cron job:', error);
  }
};

// Schedule cron job to run daily at 9:00 AM
// Cron format: minute hour day month day-of-week
const startPaymentReminderCron = () => {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    await checkAndSendPaymentReminders();
  });

  // Also run immediately on server start (optional - for testing)
  // Uncomment the line below if you want to test immediately on server start
  // checkAndSendPaymentReminders();

  console.log('Payment reminder cron job scheduled to run daily at 9:00 AM');
};

module.exports = {
  startPaymentReminderCron,
  checkAndSendPaymentReminders, // Export for manual testing
};


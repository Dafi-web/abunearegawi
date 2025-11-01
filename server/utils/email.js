const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // If email credentials are not configured, return null (emails won't be sent)
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email configuration not found. Email notifications will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
const sendEmail = async (to, subject, html, text = '') => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`[Email would be sent] To: ${to}, Subject: ${subject}`);
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Abune Aregawi Church'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send payment reminder email
const sendPaymentReminderEmail = async (user, daysUntilDue = 2) => {
  const subject = `Payment Reminder: Your membership payment is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #c8102e 0%, #dc143c 50%, #ffc72c 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Abune Aregawi Tigrayans Orthodox Church</h1>
        </div>
        <div class="content">
          <h2>Payment Reminder</h2>
          <p>Dear ${user.name},</p>
          <p>This is a friendly reminder that your monthly membership payment of <strong>€10</strong> is due in <strong>${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}</strong>.</p>
          <p>To continue enjoying the benefits of membership, please make your payment as soon as possible.</p>
          <p>You can make your payment by visiting our website and logging into your account.</p>
          <a href="${process.env.FRONTEND_URL}/membership" class="button">Pay Now</a>
          <p>Thank you for your continued support!</p>
          <p>Blessings,<br>The Abune Aregawi Church Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>© ${new Date().getFullYear()} Abune Aregawi Tigrayans Orthodox Church, Amsterdam</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Payment Reminder

Dear ${user.name},

This is a friendly reminder that your monthly membership payment of €10 is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}.

To continue enjoying the benefits of membership, please make your payment as soon as possible by visiting: ${process.env.FRONTEND_URL}/membership

Thank you for your continued support!

Blessings,
The Abune Aregawi Church Team
  `;

  return await sendEmail(user.email, subject, html, text);
};

module.exports = {
  sendEmail,
  sendPaymentReminderEmail,
};


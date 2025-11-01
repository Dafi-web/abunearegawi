const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Optional auth middleware for donations
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const User = require('../models/User');
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

const router = express.Router();

// Create payment intent (for Payment Element)
router.post('/create-intent', optionalAuth, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1 EUR'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount } = req.body;
    const amountInCents = Math.round(amount * 100);

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe')) {
      return res.status(500).json({ 
        message: 'Stripe is not configured. Please add your Stripe secret key to the .env file.' 
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      payment_method_types: ['ideal', 'card'],
      metadata: {
        type: 'donation',
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create payment intent. Please check your Stripe configuration.' 
    });
  }
});

// Create payment intent for donation (allow anonymous)
router.post('/donation', optionalAuth, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1 EUR'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, paymentMethodId } = req.body;
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      payment_method_types: ['ideal', 'card'],
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.FRONTEND_URL}/payment-success`,
    });

    if (paymentIntent.status === 'succeeded') {
      const payment = new Payment({
        user: req.user ? req.user._id : null,
        type: 'donation',
        amount: amount,
        status: 'completed',
        stripePaymentIntentId: paymentIntent.id,
        paymentMethod: paymentMethodId ? 'card' : 'ideal',
      });
      await payment.save();
    }

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Create setup intent for subscriptions (to collect payment method)
router.post('/create-setup-intent', auth, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe')) {
      return res.status(500).json({ 
        message: 'Stripe is not configured. Please add your Stripe secret key to the .env file.' 
      });
    }

    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card', 'ideal'],
      customer: req.user.stripeCustomerId || undefined,
    });

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error('Setup intent creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create setup intent.' 
    });
  }
});

// Create subscription (monthly membership)
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    let customer;
    if (req.user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(req.user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        payment_method: paymentMethodId,
      });
      req.user.stripeCustomerId = customer.id;
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription (10 EUR per month)
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Church Membership',
            description: 'Monthly membership fee',
          },
          unit_amount: 1000, // 10 EUR in cents
          recurring: {
            interval: 'month',
          },
        },
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    req.user.stripeSubscriptionId = subscription.id;
    req.user.subscriptionStatus = subscription.status;
    req.user.isMember = true;
    req.user.memberSince = new Date();
    await req.user.save();

    // Create payment record
    const payment = new Payment({
      user: req.user._id,
      type: 'subscription',
      amount: 10,
      status: subscription.status === 'active' ? 'completed' : 'pending',
      stripeSubscriptionId: subscription.id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      paymentMethod: 'card',
    });
    await payment.save();

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get user payments
router.get('/my-payments', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Check if this is a donation
        if (paymentIntent.metadata && paymentIntent.metadata.type === 'donation') {
          const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });
          if (!payment) {
            // Find user by customer ID or create anonymous payment
            const donationUser = paymentIntent.customer ? await User.findOne({ stripeCustomerId: paymentIntent.customer }) : null;
            const newPayment = new Payment({
              user: donationUser ? donationUser._id : null,
              type: 'donation',
              amount: paymentIntent.amount / 100,
              status: 'completed',
              stripePaymentIntentId: paymentIntent.id,
              paymentMethod: paymentIntent.payment_method_types[0] || 'card',
            });
            await newPayment.save();
          }
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        const user = await User.findOne({ stripeCustomerId: invoice.customer });
        if (user && user.stripeSubscriptionId) {
          const payment = new Payment({
            user: user._id,
            type: 'subscription',
            amount: invoice.amount_paid / 100,
            status: 'completed',
            stripeSubscriptionId: invoice.subscription,
            month: new Date(invoice.period_start * 1000).getMonth() + 1,
            year: new Date(invoice.period_start * 1000).getFullYear(),
            paymentMethod: 'card',
          });
          await payment.save();
          
          user.subscriptionStatus = 'active';
          user.isMember = true;
          await user.save();
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        const failedUser = await User.findOne({ stripeCustomerId: failedInvoice.customer });
        if (failedUser) {
          failedUser.subscriptionStatus = 'past_due';
          await failedUser.save();
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        const deletedUser = await User.findOne({ stripeCustomerId: deletedSubscription.customer });
        if (deletedUser) {
          deletedUser.subscriptionStatus = 'canceled';
          deletedUser.isMember = false;
          await deletedUser.save();
        }
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

module.exports = router;


const express = require('express');
const mongoose = require('mongoose');
const { createMollieClient, SequenceType } = require('@mollie/api-client');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const MEMBERSHIP_AMOUNT = '10.00';

const getMollieApiKey = () => {
  const raw = process.env.MOLLIE_API_KEY;
  if (!raw) return null;

  const apiKey = raw
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^['"]|['"]$/g, '');

  if (!apiKey || apiKey.includes('your_mollie')) return null;
  return apiKey;
};

const getMollieKeyHint = (apiKey) => {
  if (!apiKey) return 'not set';
  if (apiKey.length < 20) return `too short (${apiKey.length} chars)`;
  return `starts with "${apiKey.slice(0, 5)}..."`;
};

const getMollieClient = () => {
  const apiKey = getMollieApiKey();
  if (!apiKey) return null;
  return createMollieClient({ apiKey });
};

const getMollieConfigError = () => {
  const apiKey = getMollieApiKey();
  if (!apiKey) {
    return 'Mollie is not configured. Please add MOLLIE_API_KEY to your server environment variables.';
  }
  if (!/^test_|live_/.test(apiKey)) {
    return `Mollie API key is invalid (${getMollieKeyHint(apiKey)}). Use the API key from Mollie Dashboard → Developers → API keys. It must start with test_ or live_, with no quotes or spaces.`;
  }
  return null;
};

const getBackendUrl = () =>
  process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5001';

const getFrontendUrl = () =>
  (process.env.FRONTEND_URL || 'http://localhost:3000').split(',')[0].trim();

const mapMollieMethod = (method) => {
  if (!method) return 'other';
  if (method === 'ideal') return 'ideal';
  if (['creditcard', 'applepay', 'paypal', 'bancontact'].includes(method)) return 'card';
  return 'other';
};

const resolveUserId = (userId) =>
  userId && mongoose.Types.ObjectId.isValid(userId) ? userId : null;

const paymentStatusFromMollie = (mollieStatus) => {
  if (mollieStatus === 'paid') return 'completed';
  if (mollieStatus === 'failed' || mollieStatus === 'canceled' || mollieStatus === 'expired') {
    return 'failed';
  }
  return 'pending';
};

const syncMollieDonation = async (molliePayment, userId = null) => {
  const status = paymentStatusFromMollie(molliePayment.status);
  const resolvedUserId = resolveUserId(userId);

  let payment = await Payment.findOne({ molliePaymentId: molliePayment.id });
  if (payment) {
    payment.status = status;
    payment.paymentMethod = mapMollieMethod(molliePayment.method);
    await payment.save();
    return payment;
  }

  payment = new Payment({
    user: resolvedUserId,
    type: 'donation',
    amount: parseFloat(molliePayment.amount.value),
    status,
    molliePaymentId: molliePayment.id,
    paymentMethod: mapMollieMethod(molliePayment.method),
  });
  await payment.save();
  return payment;
};

const syncSubscriptionPayment = async (molliePayment, user) => {
  const status = paymentStatusFromMollie(molliePayment.status);
  const now = new Date();

  let payment = await Payment.findOne({ molliePaymentId: molliePayment.id });
  if (payment) {
    payment.status = status;
    payment.paymentMethod = mapMollieMethod(molliePayment.method);
    await payment.save();
    return payment;
  }

  payment = new Payment({
    user: user._id,
    type: 'subscription',
    amount: parseFloat(molliePayment.amount.value),
    status,
    molliePaymentId: molliePayment.id,
    mollieSubscriptionId: molliePayment.subscriptionId || user.mollieSubscriptionId,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    paymentMethod: mapMollieMethod(molliePayment.method),
  });
  await payment.save();
  return payment;
};

const getOrCreateMollieCustomer = async (mollieClient, user) => {
  if (user.mollieCustomerId) {
    try {
      return await mollieClient.customers.get(user.mollieCustomerId);
    } catch (error) {
      console.warn(`Mollie customer ${user.mollieCustomerId} not found, creating new one`);
    }
  }

  const customer = await mollieClient.customers.create({
    name: user.name,
    email: user.email,
    metadata: { userId: user._id.toString() },
  });

  user.mollieCustomerId = customer.id;
  await user.save();
  return customer;
};

const createMollieCheckoutPayment = async ({
  mollieClient,
  amount,
  description,
  metadata,
  customerId,
  sequenceType,
}) => {
  const frontendUrl = getFrontendUrl();
  const paymentData = {
    amount: {
      currency: 'EUR',
      value: parseFloat(amount).toFixed(2),
    },
    description,
    redirectUrl: `${frontendUrl}/payment-success`,
    webhookUrl: `${getBackendUrl()}/api/payments/mollie-webhook`,
    metadata,
  };

  let molliePayment;
  if (customerId) {
    molliePayment = await mollieClient.customerPayments.create({
      customerId,
      ...paymentData,
      sequenceType: sequenceType || SequenceType.oneoff,
    });
  } else {
    molliePayment = await mollieClient.payments.create(paymentData);
  }

  await mollieClient.payments.update(molliePayment.id, {
    redirectUrl: `${frontendUrl}/payment-success?paymentId=${molliePayment.id}`,
  });

  return molliePayment;
};

const handleMembershipFirstPayment = async (molliePayment) => {
  const userId = resolveUserId(molliePayment.metadata?.userId);
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  await syncSubscriptionPayment(molliePayment, user);

  if (molliePayment.status !== 'paid') return;

  const mollieClient = getMollieClient();
  if (!mollieClient) return;

  if (molliePayment.customerId) {
    user.mollieCustomerId = molliePayment.customerId;
  }

  if (!user.mollieSubscriptionId && user.mollieCustomerId) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);

    const subscription = await mollieClient.customerSubscriptions.create({
      customerId: user.mollieCustomerId,
      amount: { currency: 'EUR', value: MEMBERSHIP_AMOUNT },
      interval: '1 month',
      description: 'Church Membership - Monthly',
      webhookUrl: `${getBackendUrl()}/api/payments/mollie-webhook`,
      startDate: startDate.toISOString().split('T')[0],
    });

    user.mollieSubscriptionId = subscription.id;
  }

  user.isMember = true;
  user.subscriptionStatus = 'active';
  if (!user.memberSince) {
    user.memberSince = new Date();
  }
  await user.save();
};

const handleSubscriptionPayment = async (molliePayment) => {
  let user = null;

  if (molliePayment.subscriptionId) {
    user = await User.findOne({ mollieSubscriptionId: molliePayment.subscriptionId });
  }
  if (!user && molliePayment.customerId) {
    user = await User.findOne({ mollieCustomerId: molliePayment.customerId });
  }
  if (!user) return;

  await syncSubscriptionPayment(molliePayment, user);

  if (molliePayment.status === 'paid') {
    user.subscriptionStatus = 'active';
    user.isMember = true;
    await user.save();
  } else if (molliePayment.status === 'failed') {
    user.subscriptionStatus = 'past_due';
    await user.save();
  }
};

const processMolliePayment = async (molliePayment) => {
  const type = molliePayment.metadata?.type;

  if (type === 'donation') {
    return syncMollieDonation(molliePayment, molliePayment.metadata?.userId);
  }

  if (type === 'membership_first') {
    await handleMembershipFirstPayment(molliePayment);
    return Payment.findOne({ molliePaymentId: molliePayment.id });
  }

  if (molliePayment.subscriptionId || type === 'subscription') {
    await handleSubscriptionPayment(molliePayment);
    return Payment.findOne({ molliePaymentId: molliePayment.id });
  }

  return null;
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

router.post('/create-mollie-payment', optionalAuth, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1 EUR'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mollieConfigError = getMollieConfigError();
    if (mollieConfigError) {
      return res.status(500).json({ message: mollieConfigError });
    }

    const mollieClient = getMollieClient();
    const { amount } = req.body;
    const userId = req.user ? req.user._id.toString() : '';

    const molliePayment = await createMollieCheckoutPayment({
      mollieClient,
      amount,
      description: 'Donation to Abune Aregawi Church',
      metadata: { type: 'donation', userId },
    });

    await syncMollieDonation(molliePayment, req.user ? req.user._id : null);

    res.json({ checkoutUrl: molliePayment.getCheckoutUrl(), paymentId: molliePayment.id });
  } catch (error) {
    console.error('Mollie payment creation error:', error);
    const message = error.message?.includes('Authorization')
      ? 'Mollie API key is invalid. On Render, set MOLLIE_API_KEY to your key from Mollie Dashboard → Developers → API keys (starts with test_ or live_).'
      : error.message || 'Failed to create payment. Please check your Mollie configuration.';
    res.status(500).json({ message });
  }
});

router.post('/create-membership', auth, async (req, res) => {
  try {
    const mollieConfigError = getMollieConfigError();
    if (mollieConfigError) {
      return res.status(500).json({ message: mollieConfigError });
    }

    const mollieClient = getMollieClient();

    if (req.user.isMember && req.user.subscriptionStatus === 'active') {
      return res.status(400).json({ message: 'You are already an active member.' });
    }

    const customer = await getOrCreateMollieCustomer(mollieClient, req.user);

    const molliePayment = await createMollieCheckoutPayment({
      mollieClient,
      amount: MEMBERSHIP_AMOUNT,
      description: 'Church Membership - First payment',
      customerId: customer.id,
      sequenceType: SequenceType.first,
      metadata: {
        type: 'membership_first',
        userId: req.user._id.toString(),
      },
    });

    await syncSubscriptionPayment(molliePayment, req.user);

    res.json({ checkoutUrl: molliePayment.getCheckoutUrl(), paymentId: molliePayment.id });
  } catch (error) {
    console.error('Mollie membership creation error:', error);
    res.status(500).json({
      message: error.message || 'Failed to start membership. Please check your Mollie configuration.',
    });
  }
});

router.post('/mollie-webhook', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const mollieClient = getMollieClient();
    if (!mollieClient) {
      return res.status(500).send('Mollie not configured');
    }

    const paymentId = req.body.id;
    if (!paymentId) {
      return res.status(400).send('Missing payment id');
    }

    const molliePayment = await mollieClient.payments.get(paymentId);
    await processMolliePayment(molliePayment);

    res.status(200).send('OK');
  } catch (error) {
    console.error('Mollie webhook error:', error);
    res.status(500).send('Webhook handler failed');
  }
});

router.get('/mollie-status/:paymentId', async (req, res) => {
  try {
    const mollieClient = getMollieClient();
    if (!mollieClient) {
      return res.status(500).json({ message: 'Mollie is not configured' });
    }

    const molliePayment = await mollieClient.payments.get(req.params.paymentId);
    const payment = await processMolliePayment(molliePayment);

    if (!payment && molliePayment.metadata?.type !== 'membership_first') {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const paymentType = molliePayment.metadata?.type === 'membership_first'
      ? 'membership'
      : molliePayment.metadata?.type === 'donation'
        ? 'donation'
        : 'subscription';

    res.json({
      status: payment?.status || paymentStatusFromMollie(molliePayment.status),
      mollieStatus: molliePayment.status,
      amount: payment?.amount || parseFloat(molliePayment.amount.value),
      type: paymentType,
    });
  } catch (error) {
    console.error('Mollie status check error:', error);
    res.status(500).json({ message: 'Failed to check payment status' });
  }
});

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

module.exports = router;

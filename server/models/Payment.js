const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  type: {
    type: String,
    enum: ['subscription', 'donation'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'EUR',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  molliePaymentId: {
    type: String,
  },
  mollieSubscriptionId: {
    type: String,
  },
  month: {
    type: Number,
  },
  year: {
    type: Number,
  },
  paymentMethod: {
    type: String,
    enum: ['ideal', 'card', 'other'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);

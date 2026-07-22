const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    type: {
      type: String,
      required: true,
      enum: ['credit', 'debit'],
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ['Credit Card', 'Direct Deposit', 'Cash', 'Bank Transfer'],
    },
    is_pending: {
      type: Boolean,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Income', 'Shopping', 'Housing', 'Travel'],
    },
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);

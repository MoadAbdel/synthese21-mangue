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

transactionSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const accountId = ret.account_id && ret.account_id._id ? ret.account_id._id : ret.account_id;
    ret.links = {
      update: `/api/accounts/${accountId}/transactions/${ret._id}`,
      delete: `/api/accounts/${accountId}/transactions/${ret._id}`,
    };
    return ret;
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);

const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

accountSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.links = {
      update: `/api/accounts/${ret._id}`,
      delete: `/api/accounts/${ret._id}`,
      create_transaction: `/api/accounts/${ret._id}/transactions`,
      transactions: `/api/accounts/${ret._id}/transactions`,
      pending_transactions: `/api/accounts/${ret._id}/transactions/pending`,
    };
    return ret;
  },
});

module.exports = mongoose.model('Account', accountSchema);

const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../middleware/asyncHandler');

const TRANSACTION_FIELDS = [
  'label',
  'type',
  'amount',
  'date',
  'payment_method',
  'is_pending',
  'category',
];

function pickFields(body) {
  const data = {};
  for (const field of TRANSACTION_FIELDS) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }
  return data;
}

async function computeAccountBalance(accountId) {
  const [result] = await Transaction.aggregate([
    { $match: { account_id: new mongoose.Types.ObjectId(accountId) } },
    {
      $group: {
        _id: null,
        balance: {
          $sum: {
            $cond: [{ $eq: ['$type', 'credit'] }, '$amount', { $multiply: ['$amount', -1] }],
          },
        },
      },
    },
  ]);
  return result ? result.balance : 0;
}

const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.create({
    ...pickFields(req.body),
    account_id: res.locals.account._id,
  });
  res.status(201).json(transaction);
});

const listTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ account_id: res.locals.account._id }).sort('-date');
  const balance = await computeAccountBalance(res.locals.account._id);
  res.json({ transactions, balance });
});

const pendingTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    account_id: res.locals.account._id,
    is_pending: true,
  }).sort('-date');
  res.json(transactions);
});

const populatedTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ account_id: res.locals.account._id })
    .populate('account_id')
    .sort('-date');
  res.json(transactions);
});

const updateTransaction = asyncHandler(async (req, res) => {
  Object.assign(res.locals.transaction, pickFields(req.body));
  await res.locals.transaction.save();
  res.json(res.locals.transaction);
});

const deleteTransaction = asyncHandler(async (req, res) => {
  await res.locals.transaction.deleteOne();
  res.status(204).send();
});

module.exports = {
  createTransaction,
  listTransactions,
  pendingTransactions,
  populatedTransactions,
  updateTransaction,
  deleteTransaction,
};

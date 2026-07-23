const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../middleware/asyncHandler');

function balanceExpr(typeField, amountField) {
  return { $cond: [{ $eq: [typeField, 'credit'] }, amountField, { $multiply: [amountField, -1] }] };
}

const createAccount = asyncHandler(async (req, res) => {
  const account = await Account.create({
    name: req.body.name,
    user_id: res.locals.userId,
  });
  res.status(201).json(account);
});

const listAccounts = asyncHandler(async (req, res) => {
  const results = await Account.aggregate([
    { $match: { user_id: new mongoose.Types.ObjectId(res.locals.userId) } },
    {
      $lookup: {
        from: 'transactions',
        localField: '_id',
        foreignField: 'account_id',
        as: 'transactions',
      },
    },
    {
      $addFields: {
        balance: {
          $sum: {
            $map: {
              input: '$transactions',
              as: 'tx',
              in: balanceExpr('$$tx.type', '$$tx.amount'),
            },
          },
        },
      },
    },
    { $project: { transactions: 0 } },
  ]);

  const accounts = results.map((result) => ({
    ...Account.hydrate(result).toJSON(),
    balance: result.balance,
  }));

  res.json(accounts);
});

const updateAccount = asyncHandler(async (req, res) => {
  Object.assign(res.locals.account, { name: req.body.name });
  await res.locals.account.save();
  res.json(res.locals.account);
});

const deleteAccount = asyncHandler(async (req, res) => {
  await Transaction.deleteMany({ account_id: res.locals.account._id });
  await res.locals.account.deleteOne();
  res.status(204).send();
});

const globalBalance = asyncHandler(async (req, res) => {
  const [result] = await Transaction.aggregate([
    {
      $lookup: {
        from: 'accounts',
        localField: 'account_id',
        foreignField: '_id',
        as: 'account',
      },
    },
    { $unwind: '$account' },
    { $match: { 'account.user_id': new mongoose.Types.ObjectId(res.locals.userId) } },
    {
      $group: {
        _id: null,
        balance: { $sum: balanceExpr('$type', '$amount') },
      },
    },
  ]);

  res.json({ balance: result ? result.balance : 0 });
});

module.exports = {
  createAccount,
  listAccounts,
  updateAccount,
  deleteAccount,
  globalBalance,
};

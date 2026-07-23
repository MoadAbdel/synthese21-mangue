const Transaction = require('../models/Transaction');
const asyncHandler = require('./asyncHandler');

module.exports = asyncHandler(async function checkTransactionOwnership(req, res, next) {
  const transaction = await Transaction.findById(req.params.transactionId).populate('account_id');

  if (!transaction || !transaction.account_id) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  if (transaction.account_id.user_id.toString() !== res.locals.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  transaction.depopulate('account_id');
  res.locals.transaction = transaction;
  next();
});

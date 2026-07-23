const Account = require('../models/Account');
const asyncHandler = require('./asyncHandler');

module.exports = asyncHandler(async function checkAccountOwnership(req, res, next) {
  const account = await Account.findById(req.params.accountId);

  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  if (account.user_id.toString() !== res.locals.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.locals.account = account;
  next();
});

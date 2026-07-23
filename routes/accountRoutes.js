const express = require('express');
const auth = require('../middleware/auth');
const checkAccountOwnership = require('../middleware/checkAccountOwnership');
const checkTransactionOwnership = require('../middleware/checkTransactionOwnership');
const {
  createAccount,
  listAccounts,
  updateAccount,
  deleteAccount,
  globalBalance,
} = require('../controllers/accountController');
const {
  createTransaction,
  listTransactions,
  pendingTransactions,
  populatedTransactions,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

const router = express.Router();

router.use(auth);

router.post('/', createAccount);
router.get('/', listAccounts);
router.get('/global-balance', globalBalance);

router.put('/:accountId', checkAccountOwnership, updateAccount);
router.delete('/:accountId', checkAccountOwnership, deleteAccount);

router.post('/:accountId/transactions', checkAccountOwnership, createTransaction);
router.get('/:accountId/transactions/pending', checkAccountOwnership, pendingTransactions);
router.get('/:accountId/transactions/populated', checkAccountOwnership, populatedTransactions);
router.get('/:accountId/transactions', checkAccountOwnership, listTransactions);

router.put(
  '/:accountId/transactions/:transactionId',
  checkTransactionOwnership,
  updateTransaction
);
router.delete(
  '/:accountId/transactions/:transactionId',
  checkTransactionOwnership,
  deleteTransaction
);

module.exports = router;

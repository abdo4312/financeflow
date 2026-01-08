import express from 'express';
import { body } from 'express-validator';
import { 
  createTransaction, 
  getTransactions, 
  getTransaction, 
  updateTransaction, 
  deleteTransaction,
  getRecentTransactions,
  bulkDeleteTransactions,
  uploadReceipt
} from '../controllers/transaction.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/recent', getRecentTransactions);
router.post('/bulk-delete', bulkDeleteTransactions);

router.route('/')
  .get(getTransactions)
  .post([
    body('amount', 'Amount is required and must be a number').isNumeric(),
    body('type', 'Type must be income or expense').isIn(['income', 'expense']),
    body('categoryId', 'Category ID is required').notEmpty(),
    body('date', 'Valid date is required').isISO8601(),
    validate
  ], createTransaction);

router.route('/:id')
  .get(getTransaction)
  .patch(updateTransaction)
  .delete(deleteTransaction);

router.post('/:id/receipt', upload.single('receipt'), uploadReceipt);

export default router;

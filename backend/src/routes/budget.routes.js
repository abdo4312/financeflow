import express from 'express';
import { body } from 'express-validator';
import { 
  createBudget, 
  getBudgets, 
  updateBudget, 
  deleteBudget 
} from '../controllers/budget.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBudgets)
  .post([
    body('categoryId', 'Category ID is required').notEmpty(),
    body('amount', 'Amount is required and must be a number').isNumeric(),
    body('startDate', 'Start date is required').isISO8601(),
    body('endDate', 'End date is required').isISO8601(),
    validate
  ], createBudget);

router.route('/:id')
  .patch(updateBudget)
  .delete(deleteBudget);

export default router;

import express from 'express';
import { body } from 'express-validator';
import { 
  createCategory, 
  getCategories, 
  getCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/category.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCategories)
  .post([
    body('name', 'Name is required').notEmpty(),
    body('type', 'Type must be income or expense').isIn(['income', 'expense']),
    validate
  ], createCategory);

router.route('/:id')
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;

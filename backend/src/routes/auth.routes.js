import express from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  verifyEmail, 
  refreshToken, 
  logout,
  forgotPassword,
  resetPassword 
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  validate
], register);

router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists(),
  validate
], login);

router.get('/verify-email/:token', verifyEmail);

router.post('/refresh-token', refreshToken);

router.post('/logout', protect, logout);

router.post('/forgot-password', [
  body('email', 'Please include a valid email').isEmail(),
  validate
], forgotPassword);

router.post('/reset-password/:token', [
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  validate
], resetPassword);

export default router;

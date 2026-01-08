import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  uploadProfilePicture, 
  deleteAccount 
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);
router.delete('/account', deleteAccount);

export default router;

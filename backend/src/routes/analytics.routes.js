import express from 'express';
import { 
  getSummary, 
  getCategoryStats, 
  getTrend,
  exportToExcel,
  exportToPdf 
} from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/category-stats', getCategoryStats);
router.get('/trend', getTrend);
router.get('/export/excel', exportToExcel);
router.get('/export/pdf', exportToPdf);

export default router;

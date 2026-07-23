import express from 'express';
import { reportController } from '../controllers/reportController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'MANAJER'));

router.get('/sales/daily', reportController.getDailySalesReport);
router.get('/sales/monthly', reportController.getMonthlyReport);
router.get('/products/top', reportController.getTopProducts);
router.get('/inventory', reportController.getInventoryReport);

export default router;

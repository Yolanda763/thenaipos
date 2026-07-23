import express from 'express';
import { productController } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', productController.getProducts);
router.get('/barcode/:barcode', productController.getProductByBarcode);
router.post('/', authorize('ADMIN', 'MANAJER'), productController.createProduct);
router.put('/:id', authorize('ADMIN', 'MANAJER'), productController.updateProduct);

export default router;

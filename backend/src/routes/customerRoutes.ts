import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res) => {
  res.json({ message: 'Get all customers' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create customer' });
});

export default router;

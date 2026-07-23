import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res) => {
  res.json({ message: 'Get inventory' });
});

router.post('/adjust', (req, res) => {
  res.json({ message: 'Adjust inventory' });
});

export default router;

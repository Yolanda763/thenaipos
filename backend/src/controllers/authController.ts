import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.login(email, password);
    res.json(result);
  }),

  register: asyncHandler(async (req: Request, res: Response) => {
    const { email, username, fullName, password, outletId } = req.body;

    if (!email || !username || !fullName || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await authService.register({
      email,
      username,
      fullName,
      password,
      outletId,
    });

    res.status(201).json(result);
  }),

  getProfile: asyncHandler(async (req: AuthRequest, res: Response) => {
    res.json({
      userId: req.userId,
      email: req.userEmail,
      role: req.role,
    });
  }),
};

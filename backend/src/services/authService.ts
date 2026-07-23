import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const authService = {
  async login(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { outlet: true },
      });

      if (!user) {
        throw new AppError(401, 'User not found');
      }

      if (!user.isActive) {
        throw new AppError(403, 'User is inactive');
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError(401, 'Invalid password');
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          outletId: user.outletId,
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      logger.info(`User logged in: ${email}`);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          outletId: user.outletId,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  async register(data: any) {
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: data.email }, { username: data.username }],
        },
      });

      if (existingUser) {
        throw new AppError(400, 'Email or username already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          fullName: data.fullName,
          passwordHash: hashedPassword,
          role: data.role || 'KASIR',
          outletId: data.outletId,
        },
      });

      logger.info(`New user registered: ${data.email}`);

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      };
    } catch (error) {
      throw error;
    }
  },
};

import { Router } from 'express';
import { addFoodItem, getAvailableFoodItems } from '../controllers/food.controller';
import { authenticateToken } from '../middlewares/auth'; // Updated name here
import { requireRole } from '../middlewares/role';
import { validateRequest } from '../middlewares/validate'; 
import { addFoodItemSchema } from '../validations/food.validation';

const router = Router();

router.get('/available', authenticateToken, getAvailableFoodItems); // Updated here

router.post(
  '/add',
  authenticateToken,
  requireRole(['merchant']),
  validateRequest(addFoodItemSchema),
  addFoodItem
);

export default router;
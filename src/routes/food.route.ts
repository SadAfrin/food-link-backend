import { Router } from 'express';
import { addFoodItem, getAvailableFoodItems } from '../controllers/food.controller';
import { authenticateToken } from '../middlewares/auth'; // Updated name here
import { requireRole } from '../middlewares/role';

const router = Router();

router.get('/available', authenticateToken, getAvailableFoodItems); // Updated here

router.post('/add', authenticateToken, requireRole(['merchant']), addFoodItem); // Updated here

export default router;
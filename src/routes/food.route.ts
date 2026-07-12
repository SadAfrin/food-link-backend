import { Router } from 'express';
import { addFoodItem, getAvailableFoodItems } from '../controllers/food.controller';

const router = Router();

router.post('/add', addFoodItem);
router.get('/available', getAvailableFoodItems);

export default router;
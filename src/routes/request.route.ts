import { Router } from 'express';
import { createFoodRequest } from '../controllers/request.controller';

const router = Router();

router.post('/create', createFoodRequest);

export default router;
import { Router } from 'express';
import { createFoodRequest, getMerchantRequests, updateRequestStatus } from '../controllers/request.controller';

const router = Router();

router.post('/create', createFoodRequest);
router.get('/merchant/:merchantId', getMerchantRequests);
router.patch('/status/:requestId', updateRequestStatus);

export default router;
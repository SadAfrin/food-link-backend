import { Router } from 'express';
import { 
  createFoodRequest, 
  getMerchantRequests, 
  updateRequestStatus, 
  getRecipientRequests 
} from '../controllers/request.controller';

const router = Router();

router.post('/create', createFoodRequest);
router.get('/merchant/:merchantId', getMerchantRequests);
router.patch('/status/:requestId', updateRequestStatus);
router.get('/recipient/:recipientId', getRecipientRequests);

export default router;
import { Router } from 'express';
import { 
  createFoodRequest, 
  getMerchantRequests, 
  updateRequestStatus, 
  getRecipientRequests 
} from '../controllers/request.controller';
import { authenticateToken } from '../middlewares/auth'; // Updated name here
import { requireRole } from '../middlewares/role';

const router = Router();

router.use(authenticateToken); // Updated here

router.post('/create', requireRole(['recipient']), createFoodRequest);

router.get('/merchant/:merchantId', requireRole(['merchant']), getMerchantRequests);
router.patch('/status/:requestId', requireRole(['merchant']), updateRequestStatus);

router.get('/recipient/:recipientId', requireRole(['recipient']), getRecipientRequests);

export default router;
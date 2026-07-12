import { Router } from 'express';
import { getMerchantAnalytics, getRecipientAnalytics } from '../controllers/analytics.controller';
import { authenticateToken } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';

const router = Router();

// Secure all summary routes with authentication middleware
router.use(authenticateToken);

router.get('/merchant/:merchantId', requireRole(['merchant']), getMerchantAnalytics);
router.get('/recipient/:recipientId', requireRole(['recipient']), getRecipientAnalytics);

export default router;
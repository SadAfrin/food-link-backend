import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    
    const user = req.user; 

    if (!user || !user.role) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User role not found.' });
    }

   
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden. This action requires one of the following roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};
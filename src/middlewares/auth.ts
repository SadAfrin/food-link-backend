import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided.' });
  }

  try {
    const jwksUrl = new URL(`${process.env.CLIENT_URL}/api/auth/jwks`);
    const JWKS = createRemoteJWKSet(jwksUrl);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.CLIENT_URL,
      audience: process.env.CLIENT_URL,
    });

    req.user = payload;
    next();
  } catch (error: any) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};
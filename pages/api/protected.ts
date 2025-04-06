import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, getTokenFromRequest } from '../../lib/auth';
import { ApiResponse, TokenPayload } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ userId: number }>>
) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  return res.status(200).json({ 
    data: { 
      userId: decoded.userId 
    } 
  });
}
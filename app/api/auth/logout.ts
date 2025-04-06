import { NextApiRequest, NextApiResponse } from 'next';
import { clearTokenCookie } from '../../../lib/auth';
import { ApiResponse } from '../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  clearTokenCookie(res);
  return res.status(200).json({ message: 'Logged out successfully' });
}
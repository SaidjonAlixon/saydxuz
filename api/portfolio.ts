import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const portfolios = await storage.getPublicPortfolios();
      res.json({ success: true, data: portfolios });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Portfolio ma'lumotlarini olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

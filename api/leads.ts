import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertLeadSchema } from '@shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Ariza muvaffaqiyatli yuborildi",
        leadId: lead.id 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "Ma'lumotlarda xatolik bor", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  } else if (req.method === 'GET') {
    try {
      const leads = await storage.getLeads();
      res.json({ success: true, data: leads });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Ma'lumotlarni olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

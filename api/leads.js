import { storage } from '../server/storage.js';
import { insertLeadSchema } from '@shared/schema.js';
import { sendLeadToTelegram } from '../server/telegram.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('Kelgan ma\'lumotlar:', req.body);
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      
      // Telegram kanalga yuborish
      console.log('Telegram yuborishga harakat qilinmoqda...');
      console.log('Bot token mavjudmi:', !!process.env.TELEGRAM_BOT_TOKEN);
      console.log('Kanal ID mavjudmi:', !!process.env.TELEGRAM_CHANNEL_ID);
      
      const telegramResult = await sendLeadToTelegram(lead);
      console.log('Telegram yuborish natijasi:', telegramResult);
      
      res.status(201).json({ 
        success: true, 
        message: "Ariza muvaffaqiyatli yuborildi",
        leadId: lead.id,
        telegramSent: telegramResult.success
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
};

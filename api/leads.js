import 'dotenv/config';
import { storage } from '../server/storage.js';
import { insertLeadSchema } from '../shared/schema.js';
import { sendLeadToTelegram } from '../server/telegram.js';
import { randomUUID } from 'crypto';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      console.log('Kelgan ma\'lumotlar:', req.body);
      
      // Required field'larni tekshiramiz
      if (!req.body.name || !req.body.phone || !req.body.serviceType) {
        return res.status(400).json({
          success: false,
          message: "Ism, telefon va xizmat turi majburiy maydonlar"
        });
      }
      
      const leadData = {
        name: req.body.name,
        phone: req.body.phone,
        serviceType: req.body.serviceType,
        telegram: req.body.telegram || null,
        email: req.body.email || null,
        budget: req.body.budget || null,
        timeline: req.body.timeline || null,
        description: req.body.description || null,
        fileUrl: null, // Vercel'da file upload hozircha yo'q
        source: req.body.source || "website"
      };
      
      console.log('Lead data prepared:', leadData);
      
      const validatedData = insertLeadSchema.parse(leadData);
      
      // Vercel'da database muammosi bo'lsa ham Telegram'ga yuborish
      let lead;
      try {
        lead = await storage.createLead(validatedData);
        console.log(`New lead received: ${lead.name} - ${lead.serviceType}`);
      } catch (dbError) {
        console.log('Database error, but continuing with Telegram:', dbError);
        // Database muammosi bo'lsa ham Telegram'ga yuboramiz
        lead = {
          ...validatedData,
          id: randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      
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
      console.error('Lead creation error:', error);
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
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

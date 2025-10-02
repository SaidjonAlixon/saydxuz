import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

let bot = null;

// Bot ni ishga tushirish funksiyasi
function initializeBot() {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
  
  console.log('Bot token:', BOT_TOKEN ? 'mavjud' : 'yo\'q');
  console.log('Kanal ID:', CHANNEL_ID ? 'mavjud' : 'yo\'q');
  
  if (BOT_TOKEN && CHANNEL_ID && !bot) {
    bot = new TelegramBot(BOT_TOKEN, { polling: false });
    console.log('Telegram bot ishga tushirildi');
  }
  
  return { BOT_TOKEN, CHANNEL_ID };
}

export async function sendLeadToTelegram(leadData) {
  console.log('sendLeadToTelegram chaqirildi');
  
  // Har safar environment variables'ni tekshiramiz
  const { BOT_TOKEN, CHANNEL_ID } = initializeBot();
  
  console.log('Bot mavjudmi:', !!bot);
  console.log('CHANNEL_ID mavjudmi:', !!CHANNEL_ID);
  console.log('BOT_TOKEN mavjudmi:', !!BOT_TOKEN);
  
  if (!bot || !CHANNEL_ID) {
    console.log('Telegram bot sozlanmagan yoki kanal ID topilmadi');
    console.log('Bot:', bot);
    console.log('CHANNEL_ID:', CHANNEL_ID);
    console.log('BOT_TOKEN:', BOT_TOKEN);
    return { success: false, message: 'Telegram bot sozlanmagan' };
  }

  try {
    // Ariza ma'lumotlarini formatlaymiz
    const message = `
🆕 **Yangi Ariza**

👤 **Mijoz:** ${leadData.name}
📞 **Telefon:** ${leadData.phone}
${leadData.telegram ? `📱 **Telegram:** @${leadData.telegram.replace('@', '')}` : ''}
🔧 **Xizmat:** ${leadData.serviceType}
${leadData.budget ? `💰 **Byudjet:** ${leadData.budget}` : ''}
${leadData.timeline ? `⏰ **Muddat:** ${leadData.timeline}` : ''}
${leadData.description ? `📝 **Tavsif:** ${leadData.description}` : ''}
${leadData.fileUrl ? `📎 **Qo'shimcha fayl:** ${leadData.fileUrl.split('/').pop()}` : ''}

🕐 **Vaqt:** ${new Date().toLocaleString('uz-UZ')}
🆔 **ID:** ${leadData.id}
    `.trim();

    // Avval ariza matnini yuboramiz
    const arizaResult = await bot.sendMessage(CHANNEL_ID, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

    console.log('Ariza matni yuborildi:', arizaResult.message_id);

    // Agar fayl mavjud bo'lsa, faylni alohida yuboramiz
    if (leadData.fileUrl) {
      const filePath = leadData.fileUrl.startsWith('/') ? leadData.fileUrl.substring(1) : leadData.fileUrl;
      const fullFilePath = `./${filePath}`;
      
      try {
        // Fayl turini aniqlaymiz
        const fileExtension = filePath.split('.').pop().toLowerCase();
        let fileType = 'document';
        let fileIcon = '📄';
        
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          fileType = 'photo';
          fileIcon = '🖼️';
        } else if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
          fileType = 'video';
          fileIcon = '🎥';
        } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
          fileType = 'audio';
          fileIcon = '🎵';
        } else if (['pdf'].includes(fileExtension)) {
          fileType = 'document';
          fileIcon = '📕';
        } else if (['doc', 'docx'].includes(fileExtension)) {
          fileType = 'document';
          fileIcon = '📘';
        } else if (['xls', 'xlsx'].includes(fileExtension)) {
          fileType = 'document';
          fileIcon = '📊';
        } else if (['ppt', 'pptx'].includes(fileExtension)) {
          fileType = 'document';
          fileIcon = '📋';
        } else if (['zip', 'rar', '7z'].includes(fileExtension)) {
          fileType = 'document';
          fileIcon = '🗜️';
        }

        const fileName = filePath.split('/').pop();
        const fileCaption = `${fileIcon} **Qo'shimcha fayl:** ${fileName}`;

        // Faylni alohida yuboramiz
        let fileResult;
        if (fileType === 'photo') {
          fileResult = await bot.sendPhoto(CHANNEL_ID, fullFilePath, {
            caption: fileCaption,
            parse_mode: 'Markdown'
          });
        } else if (fileType === 'video') {
          fileResult = await bot.sendVideo(CHANNEL_ID, fullFilePath, {
            caption: fileCaption,
            parse_mode: 'Markdown'
          });
        } else if (fileType === 'audio') {
          fileResult = await bot.sendAudio(CHANNEL_ID, fullFilePath, {
            caption: fileCaption,
            parse_mode: 'Markdown'
          });
        } else {
          // Barcha boshqa fayllar uchun document sifatida yuboramiz
          fileResult = await bot.sendDocument(CHANNEL_ID, fullFilePath, {
            caption: fileCaption,
            parse_mode: 'Markdown'
          });
        }

        console.log('Fayl yuborildi:', fileResult.message_id);
      } catch (fileError) {
        console.log('Fayl yuborishda xatolik:', fileError.message);
      }
    }

    // Natijani qaytaramiz
    const result = arizaResult;

    console.log('Ariza Telegram kanalga yuborildi:', result.message_id);
    return { 
      success: true, 
      messageId: result.message_id,
      message: 'Ariza muvaffaqiyatli yuborildi'
    };

  } catch (error) {
    console.error('Telegram xabar yuborishda xatolik:', error);
    return { 
      success: false, 
      message: 'Telegram xabar yuborishda xatolik: ' + error.message 
    };
  }
}

export { bot };

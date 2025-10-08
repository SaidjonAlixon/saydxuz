import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

// Vercel uchun - har safar yangi bot instance yaratamiz
export async function sendLeadToTelegram(leadData) {
  console.log('sendLeadToTelegram chaqirildi');
  
  // To'g'ridan-to'g'ri kodga kiritilgan qiymatlar (fallback)
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8035044995:AAEaf8t64VzYT8fyxFnowXe474wQBAhrA1k';
  const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002663722196';
  
  console.log('Bot token:', BOT_TOKEN ? 'mavjud' : 'yo\'q');
  console.log('Kanal ID:', CHANNEL_ID ? 'mavjud' : 'yo\'q');
  
  if (!BOT_TOKEN || !CHANNEL_ID) {
    console.log('Telegram bot sozlanmagan yoki kanal ID topilmadi');
    console.log('BOT_TOKEN:', BOT_TOKEN);
    console.log('CHANNEL_ID:', CHANNEL_ID);
    return { success: false, message: 'Telegram bot sozlanmagan' };
  }
  
  // Har safar yangi bot instance yaratamiz (Vercel serverless uchun)
  const bot = new TelegramBot(BOT_TOKEN, { polling: false });
  console.log('Telegram bot ishga tushirildi');

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
      try {
        // Base64 fayl uchun
        if (leadData.fileUrl.startsWith('data:')) {
          const [header, base64Data] = leadData.fileUrl.split(',');
          const mimeType = header.match(/data:([^;]+)/)?.[1] || 'application/octet-stream';
          const fileExtension = mimeType.split('/')[1] || 'bin';
          
          // Fayl turini aniqlaymiz
          let fileType = 'document';
          let fileIcon = '📄';
          
          if (mimeType.startsWith('image/')) {
            fileType = 'photo';
            fileIcon = '🖼️';
          } else if (mimeType.startsWith('video/')) {
            fileType = 'video';
            fileIcon = '🎥';
          } else if (mimeType.startsWith('audio/')) {
            fileType = 'audio';
            fileIcon = '🎵';
          } else if (mimeType === 'application/pdf') {
            fileType = 'document';
            fileIcon = '📕';
          } else if (mimeType.includes('word') || mimeType.includes('document')) {
            fileType = 'document';
            fileIcon = '📘';
          } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
            fileType = 'document';
            fileIcon = '📊';
          } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
            fileType = 'document';
            fileIcon = '📋';
          } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) {
            fileType = 'document';
            fileIcon = '🗜️';
          }

          // Fayl nomini olamiz (agar mavjud bo'lsa)
          const fileName = leadData.fileName || `fayl.${fileExtension}`;
          const fileCaption = `${fileIcon} **Qo'shimcha fayl:** ${fileName}`;

          // Base64 faylni Buffer'ga o'tkazamiz
          const fileBuffer = Buffer.from(base64Data, 'base64');

          // Faylni alohida yuboramiz
          let fileResult;
          if (fileType === 'photo') {
            fileResult = await bot.sendPhoto(CHANNEL_ID, fileBuffer, {
              caption: fileCaption,
              parse_mode: 'Markdown'
            });
          } else if (fileType === 'video') {
            fileResult = await bot.sendVideo(CHANNEL_ID, fileBuffer, {
              caption: fileCaption,
              parse_mode: 'Markdown'
            });
          } else if (fileType === 'audio') {
            fileResult = await bot.sendAudio(CHANNEL_ID, fileBuffer, {
              caption: fileCaption,
              parse_mode: 'Markdown'
            });
          } else {
            // Barcha boshqa fayllar uchun document sifatida yuboramiz
            fileResult = await bot.sendDocument(CHANNEL_ID, fileBuffer, {
              caption: fileCaption,
              parse_mode: 'Markdown',
              filename: fileName
            });
          }

          console.log('Fayl yuborildi:', fileResult.message_id);
        } else {
          // Oddiy fayl URL uchun (eski usul)
          const filePath = leadData.fileUrl.startsWith('/') ? leadData.fileUrl.substring(1) : leadData.fileUrl;
          const fullFilePath = leadData.fileUrl.startsWith('/tmp/') ? leadData.fileUrl : `./${filePath}`;
          
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
        }
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

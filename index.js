const express = require('express');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const port = process.env.PORT || 3000;

// إنشاء عميل واتساب مع حفظ الجلسة
const client = new Client({
  authStrategy: new LocalAuth(),
});

let qrImageUrl = '';

// عند توليد QR Code، تحويله إلى صورة Base64
client.on('qr', (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('خطأ في توليد صورة QR:', err);
      return;
    }
    qrImageUrl = url;
    console.log('تم تحديث QR Code');
  });
});

client.on('ready', () => {
  console.log('عميل واتساب جاهز!');
});

client.initialize();

// صفحة الويب لعرض QR Code
app.get('/', (req, res) => {
  if (!qrImageUrl) {
    res.send('<h3>يتم توليد QR Code، يرجى الانتظار...</h3>');
  } else {
    res.send(`
      <html lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>ربط واتساب</title>
        </head>
        <body>
          <h1>امسح الكود لربط واتساب</h1>
          <img src="${qrImageUrl}" alt="QR Code">
        </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(`الخادم يعمل على http://localhost:${port}`);
});
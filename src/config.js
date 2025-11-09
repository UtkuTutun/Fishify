require('dotenv').config();


const config = {
  prefix: '!',
  token: process.env.DISCORD_TOKEN,
  mongoUri: process.env.MONGODB_URI,
  currency: {
    name: "Lira",
    icon: "₺"
  },
  // Bu komutlar her kanalda kullanılabilir (kanal kısıtlamasından muaf)
  alwaysAllowedCommands: [
    'kanalseç',
    'kanalekle',
    'kanalkaldır',
    'kanallar',
    'komutlar',
    'prefixdeğiştir',
    'ping'
  ],
  dailyTransferLimit: 1000, // Günlük gönderilebilecek maksimum bakiye
  dailyTransferResetHour: 0, // Türkiye saatiyle sıfırlanma saati (0 = 24:00)
};

module.exports = config;
require('dotenv').config();



const economy = require('./config/economy');

const config = {
  prefix: '!',
  token: process.env.DISCORD_TOKEN,
  mongoUri: process.env.MONGODB_URI,
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
  economy
};

module.exports = config;
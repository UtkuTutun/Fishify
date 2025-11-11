require('dotenv').config();

const path = require('path');

const alwaysAllowedCommands = require('./config/allowedCommands');
const economy = require('./config/economy');


const ensureEnvVars = require('./core/utils/ensureEnvVars');




// Tüm önemli config ve env değerlerini kontrol et
const channels = require('./config/channels');
const economyConfig = require('./config/economy');

ensureEnvVars({
  envKeys: ['DISCORD_TOKEN', 'MONGODB_URI'],
  configChecks: [
    { name: 'nodeEnv', value: 'development' },
    { name: 'prefix', value: '!' },
    { name: 'logLevel', value: 'debug' },
    // channels.js kritik alanlar
    { name: 'statusChannelId', value: channels.statusChannelId },
    { name: 'logChannelId', value: channels.logChannelId },
    { name: 'fishLogChannelId', value: channels.fishLogChannelId },
    // economy.js kritik alanlar
    { name: 'currency.name', value: economyConfig.currency?.name },
    { name: 'currency.icon', value: economyConfig.currency?.icon },
    { name: 'transfer.dailyTotalLimit', value: economyConfig.transfer?.dailyTotalLimit },
    { name: 'transfer.dailyLimitPerUser', value: economyConfig.transfer?.dailyLimitPerUser },
    { name: 'transfer.fee', value: economyConfig.transfer?.fee },
    { name: 'transfer.enabled', value: economyConfig.transfer?.enabled }
  ]
});

const config = {
  // Geliştirici ayarları
  nodeEnv: 'development', // 'production' veya 'development' olarak elle değiştir
  prefix: '!',           // Bot komut prefix'i, sadece buradan değiştir
  logLevel: 'debug',     // 'debug', 'info', 'warn', 'error' gibi seviyeler
  token: process.env.DISCORD_TOKEN,
  mongoUri: process.env.MONGODB_URI,
  alwaysAllowedCommands,
  economy
};

module.exports = config;
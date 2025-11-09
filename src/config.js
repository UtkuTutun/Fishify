require('dotenv').config();

const path = require('path');

const alwaysAllowedCommands = require('./config/allowedCommands');
const economy = require('./config/economy');

function ensureEnvVars(requiredKeys) {
  const missing = requiredKeys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    const fileHint = path.resolve(process.cwd(), '.env');
    throw new Error(
      `Eksik ortam değişkenleri: ${missing.join(', ')}. ` +
      `Lütfen ${fileHint} dosyasını kontrol edin veya uygun değerleri sistem ortamına ekleyin.`
    );
  }
}

ensureEnvVars(['DISCORD_TOKEN', 'MONGODB_URI']);

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  prefix: process.env.BOT_PREFIX || '!',
  token: process.env.DISCORD_TOKEN,
  mongoUri: process.env.MONGODB_URI,
  alwaysAllowedCommands,
  economy
};

module.exports = config;
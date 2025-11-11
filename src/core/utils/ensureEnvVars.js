// Ortam değişkenleri ve config sabitlerini kontrol eden yardımcı fonksiyon

const path = require('path');
const logger = require('./logger');

function ensureEnvVars() {
  // .env kontrolü
  const envKeys = ['DISCORD_TOKEN', 'MONGODB_URI'];
  const missingEnv = envKeys.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    const fileHint = path.resolve(process.cwd(), '.env');
    const msg = `Eksik ortam değişkenleri: ${missingEnv.join(', ')}. Lütfen ${fileHint} dosyasını kontrol edin veya uygun değerleri sistem ortamına ekleyin.`;
    logger.error(msg);
    throw new Error(msg);
  }

  // config dosyalarını yükle
  const channels = require('../../config/channels');
  const economyConfig = require('../../config/economy');
  // config.js sabitleri
  const configChecks = [
    { name: 'nodeEnv', value: 'development' },
    { name: 'prefix', value: '!' },
    { name: 'logLevel', value: 'debug' },
    // channels.js kritik alanlar
    { name: 'statusChannelId', value: channels.statusChannelId },
    { name: 'logChannelId', value: channels.logChannelId },
    { name: 'fishLogChannelId', value: channels.fishLogChannelId },
    { name: 'moneyTransferLogChannelId', value: channels.moneyTransferLogChannelId },
    // economy.js kritik alanlar
    { name: 'currency.name', value: economyConfig.currency?.name },
    { name: 'currency.icon', value: economyConfig.currency?.icon },
    { name: 'transfer.dailyTotalLimit', value: economyConfig.transfer?.dailyTotalLimit },
    { name: 'transfer.dailyLimitPerUser', value: economyConfig.transfer?.dailyLimitPerUser },
    { name: 'transfer.fee', value: economyConfig.transfer?.fee },
    { name: 'transfer.enabled', value: economyConfig.transfer?.enabled }
  ];
  const missingConfig = configChecks.filter(({ value, name }) => value === undefined || value === null || value === '');
  if (missingConfig.length > 0) {
    const missingNames = missingConfig.map((c) => c.name).join(', ');
    const msg = `Eksik config ayarları: ${missingNames}. Lütfen ilgili config dosyalarını kontrol edin.`;
    logger.error(msg);
    throw new Error(msg);
  }
}

module.exports = ensureEnvVars;

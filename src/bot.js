require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');
const path = require('path');

const commandLoader = require('./core/loaders/commandLoader');
const eventLoader = require('./core/loaders/eventLoader');
const connectDatabase = require('./database/database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Komutları yükle
commandLoader(client);

// Eventleri yükle
eventLoader(client);

// MongoDB bağlantısı başarılı olursa bot başlasın

(async () => {
  try {
    await connectDatabase(config.mongoUri);
    const logger = require('./core/utils/logger');
    await logger.info('Veritabanı bağlantısı başarılı, bota giriş yapılıyor...');
    await client.login(config.token);
  } catch (err) {
    const logger = require('./core/utils/logger');
    await logger.error('Veritabanı bağlantısı başarısız, bot başlatılmadı:', err);
    process.exit(1);
  }
})();

// CTRL+C ile çıkışta offline mesajı gönder
process.on('SIGINT', async () => {
  try {
  const { sendOfflineStatus } = require('./core/services/botStatus');
    await sendOfflineStatus(client);
  } catch (e) {}
  process.exit(0);
});

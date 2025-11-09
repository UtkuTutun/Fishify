require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const config = require('./config');

const commandLoader = require('./core/loaders/commandLoader');
const eventLoader = require('./core/loaders/eventLoader');
const connectDatabase = require('./database/database');
const logger = require('./core/utils/logger');
const { sendOfflineStatus } = require('./core/services/botStatus');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.commands = new Collection();
client.config = config;

commandLoader(client);
eventLoader(client);

async function bootstrap() {
  try {
    await connectDatabase(config.mongoUri);
    await logger.info('Veritabanı bağlantısı başarılı, bota giriş yapılıyor...');
    await client.login(config.token);
  } catch (error) {
    await logger.error(error);
    await logger.error('Veritabanı bağlantısı başarısız, bot başlatılmadı.');
    process.exit(1);
  }
}

bootstrap();

process.on('SIGINT', async () => {
  try {
    await sendOfflineStatus(client);
  } catch (error) {
    await logger.error(error);
    await logger.error('Offline durumu gönderilirken hata oluştu.');
  } finally {
    process.exit(0);
  }
});

process.on('unhandledRejection', async (reason) => {
  await logger.error(reason instanceof Error ? reason : new Error(String(reason)));
  await logger.error('Yakalanmamış promise reddi tespit edildi.');
});

process.on('uncaughtException', async (error) => {
  await logger.error(error);
  await logger.error('Yakalanmamış hata nedeniyle süreç sonlandırılıyor.');
  process.exit(1);
});

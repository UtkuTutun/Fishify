// Botun genel istatistiklerini toplayan yardımcı fonksiyon
const User = require('../../../database/models/User');
const logger = require('../../utils/logger');

async function getBotStats(client) {
  const totalGuilds = client.guilds.cache.size;
  const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0);

  try {
    const dbUserCount = await User.countDocuments();
    return {
      totalGuilds,
      totalMembers,
      dbUserCount
    };
  } catch (error) {
    await logger.warn('Veritabanından kullanıcı sayısı alınamadı.');
    await logger.debug(error);
    return {
      totalGuilds,
      totalMembers,
      dbUserCount: 0
    };
  }
}

module.exports = getBotStats;

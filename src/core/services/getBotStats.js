// Botun genel istatistiklerini toplayan yardımcı fonksiyon

const User = require('../../database/models/User');

async function getBotStats(client) {
  // Discord sunucuları ve üyeleri
  const totalGuilds = client.guilds.cache.size;
  let totalMembers = 0;
  client.guilds.cache.forEach(guild => {
    totalMembers += guild.memberCount || 0;
  });

  // DB'de kayıtlı kullanıcı sayısı
  let dbUserCount = 0;
  try {
    dbUserCount = await User.countDocuments();
  } catch (e) {
    dbUserCount = 'Hata';
  }

  return {
    totalGuilds,
    totalMembers,
    dbUserCount
  };
}

module.exports = getBotStats;

// Bot açıldığında ve kapandığında durum mesajı göndermek için yardımcı fonksiyonlar
const { statusChannelId } = require('../../config/channels');
const getBotStats = require('./getBotStats');
const logger = require('../utils/logger');

function formatDateTR(date) {
  return date.toLocaleString('tr-TR', { hour12: false });
}

async function resolveStatusChannel(client) {
  if (!statusChannelId) {
    return null;
  }

  const cachedChannel = client.channels.cache.get(statusChannelId);
  if (cachedChannel) {
    return cachedChannel;
  }

  try {
    return await client.channels.fetch(statusChannelId);
  } catch (error) {
    await logger.warn('Durum kanalı alınamadı veya erişim yok.');
    await logger.debug(error);
    return null;
  }
}

async function sendStatusEmbed(client, embed) {
  const channel = await resolveStatusChannel(client);
  if (!channel) {
    return;
  }
  try {
    await channel.send({ embeds: [embed] });
  } catch (error) {
    await logger.warn('Durum mesajı gönderilemedi.');
    await logger.debug(error);
  }
}

async function sendOnlineStatus(client) {
  const stats = await getBotStats(client);
  const now = new Date();
  const embed = {
    color: 0x43b581,
    title: ':green_circle: Bot Online Oldu',
    description:
      `• **Toplam Sunucu:** ${stats.totalGuilds}\n` +
      `• **Toplam Üye (Discord):** ${stats.totalMembers}\n` +
      `• **DB'de Kayıtlı Üye:** ${stats.dbUserCount}`,
    footer: { text: `Online: ${formatDateTR(now)}` },
    timestamp: now
  };
  await sendStatusEmbed(client, embed);
}

async function sendOfflineStatus(client) {
  const stats = await getBotStats(client);
  const now = new Date();
  const embed = {
    color: 0xe74c3c,
    title: ':red_circle: Bot Offline Oldu',
    description:
      `• **Toplam Sunucu:** ${stats.totalGuilds}\n` +
      `• **Toplam Üye (Discord):** ${stats.totalMembers}\n` +
      `• **DB'de Kayıtlı Üye:** ${stats.dbUserCount}`,
    footer: { text: `Offline: ${formatDateTR(now)}` },
    timestamp: now
  };
  await sendStatusEmbed(client, embed);
}

module.exports = {
  sendOnlineStatus,
  sendOfflineStatus
};

// Bot açıldığında ve kapandığında durum mesajı göndermek için yardımcı fonksiyonlar

const { statusChannelId } = require('../../config/channels');
const getBotStats = require('./getBotStats');

function formatDateTR(date) {
  return date.toLocaleString('tr-TR', { hour12: false });
}

async function sendOnlineStatus(client) {
  if (!statusChannelId) return;
  const channel = client.channels.cache.get(statusChannelId);
  if (!channel) return;
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
  await channel.send({ embeds: [embed] });
}

async function sendOfflineStatus(client) {
  if (!statusChannelId) return;
  const channel = client.channels.cache.get(statusChannelId);
  if (!channel) return;
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
  await channel.send({ embeds: [embed] });
}

module.exports = {
  sendOnlineStatus,
  sendOfflineStatus
};

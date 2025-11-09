// Komut loglarını belirli bir kanala gönderen yardımcı fonksiyon

const { logChannelId } = require('../../config/channels');

async function logCommand({ client, user, command, args, guild, channel }) {
  const userTag = user?.tag || 'Bilinmiyor';
  const guildName = guild?.name || 'DM';
  const channelName = channel?.name || 'DM';
  const argString = args && args.length ? args.join(' ') : '-';
  const content = `📝 **Komut:** \n` +
    `Kullanıcı: ${userTag} (${user?.id})\n` +
    `Sunucu: ${guildName}\n` +
    `Kanal: ${channelName}\n` +
    `Komut: ${command}\n` +
    `Argümanlar: ${argString}`;

  // Konsola yazdır (logger ile)
  const logger = require('../utils/logger');
  logger.info(`[KOMUT LOG] ${userTag} (${user?.id}) | ${guildName} | #${channelName} | Komut: ${command} | Argümanlar: ${argString}`);

  // Discord kanalına gönder
  if (!logChannelId) return;
  const logChannel = client.channels.cache.get(logChannelId);
  if (!logChannel) return;
  try {
    await logChannel.send(content);
  } catch (e) {
    // Hata olursa sessizce geç
  }
}

module.exports = { logCommand };

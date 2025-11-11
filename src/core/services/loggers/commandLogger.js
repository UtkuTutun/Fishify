// Komut loglarını belirli bir kanala gönderen yardımcı fonksiyon
const logger = require('../../utils/logger');
const { logChannelId } = require('../../../config/channels');

async function resolveLogChannel(client) {
  if (!logChannelId) {
    return null;
  }

  const cachedChannel = client.channels.cache.get(logChannelId);
  if (cachedChannel) {
    return cachedChannel;
  }

  try {
    return await client.channels.fetch(logChannelId);
  } catch (error) {
    await logger.warn('Komut log kanalı alınamadı veya erişim yok.');
    await logger.debug(error);
    return null;
  }
}

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
  await logger.info(`[KOMUT LOG] ${userTag} (${user?.id}) | ${guildName} | #${channelName} | Komut: ${command} | Argümanlar: ${argString}`);

  // Discord kanalına gönder
  const logChannel = await resolveLogChannel(client);
  if (!logChannel) {
    return;
  }
  try {
    await logChannel.send(content);
  } catch (e) {
    await logger.warn('Komut logu kanala gönderilemedi.');
    await logger.debug(e);
  }
}

module.exports = { logCommand };

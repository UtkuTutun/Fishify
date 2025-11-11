// !fish komutu ile tutulan balıkların detaylı logunu özel kanala gönderir
const { fishLogChannelId } = require('../../config/channels');
const logger = require('../utils/logger');

async function resolveFishLogChannel(client) {
  if (!fishLogChannelId) {
    return null;
  }

  const cachedChannel = client.channels.cache.get(fishLogChannelId);
  if (cachedChannel) {
    return cachedChannel;
  }

  try {
    return await client.channels.fetch(fishLogChannelId);
  } catch (error) {
    await logger.warn('Balık log kanalı alınamadı veya erişim yok.');
    await logger.debug(error);
    return null;
  }
}

async function logFishCatch({ client, user, guild, channel, fish, amount, kg, total, time }) {
  const logChannel = await resolveFishLogChannel(client);
  if (!logChannel) {
    return;
  }

  const userTag = user?.tag || 'Bilinmiyor';
  const guildName = guild?.name || 'DM';
  const channelName = channel?.name || 'DM';
  const now = time || new Date();
  const embed = {
    color: 0x3498db,
    title: '🎣 Balık Tutuldu! (!fish)',
    description:
      `• **Kullanıcı:** ${userTag} (${user?.id})\n` +
      `• **Sunucu:** ${guildName}\n` +
      `• **Kanal:** ${channelName}\n` +
      `• **Balık:** ${fish?.name || '-'}\n` +
      `• **Adet:** ${amount || 1}\n` +
      `• **Kg:** ${kg || '-'}\n` +
      `• **Kazanç:** ${total || '-'}\n` +
      `• **Tarih:** ${now.toLocaleString('tr-TR', { hour12: false })}`,
    timestamp: now
  };

  try {
    await logChannel.send({ embeds: [embed] });
  } catch (error) {
    await logger.warn('Balık logu kanala gönderilemedi.');
    await logger.debug(error);
  }
}

module.exports = { logFishCatch };

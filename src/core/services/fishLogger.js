// !fish komutu ile tutulan balıkların detaylı logunu özel kanala gönderir

const { fishLogChannelId } = require('../../config/channels');

async function logFishCatch({ client, user, guild, channel, fish, amount, kg, total, time }) {
  if (!fishLogChannelId) return;
  const logChannel = client.channels.cache.get(fishLogChannelId);
  if (!logChannel) return;
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
  } catch (e) {
    // Hata olursa sessizce geç
  }
}

module.exports = { logFishCatch };

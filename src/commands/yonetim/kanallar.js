const { EmbedBuilder } = require('discord.js');

const guildConfigService = require('../../core/services/guildConfigService');
const { ensureGuildChannel } = require('../../core/utils/channelParser');

module.exports = {
  name: 'kanallar',
  description: 'İzinli kanalların listesini gösterir.',
  async execute(message) {
    const { allowedChannels } = await guildConfigService.getGuildSettings(message.guild.id);

    if (!allowedChannels.length) {
      const embed = new EmbedBuilder()
        .setTitle('ℹ️ İzinli Kanal Ayarı Yok')
        .setDescription('Bu sunucuda izinli kanal tanımlanmamış. Tüm kanallarda komut kullanılabilir.')
        .setColor(0x3498db)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    const mentions = allowedChannels
      .map((id) => ensureGuildChannel(id, message.guild))
      .filter(Boolean)
      .map((channel) => `• <#${channel.id}> (${channel.name})`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle('✅ İzinli Kanallar')
      .setDescription(mentions || allowedChannels.map((id) => `• \`${id}\``).join('\n'))
      .setColor(0x2ecc71)
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
};

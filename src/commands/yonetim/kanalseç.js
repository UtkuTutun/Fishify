const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const guildConfigService = require('../../core/services/guild/guildConfigService');
const { extractChannelIdsFromArgs, ensureGuildChannel } = require('../../core/utils/channelParser');

module.exports = {
  name: 'kanalseç',
  description: 'Mevcut kanalı veya belirtilen kanalları izinli kanallar listesine ekler (Yönetici yetkisi gerektirir)',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply('Bu komutu kullanmak için "Sunucuyu Yönet" yetkisine sahip olmalısın.');
    }

    const guildId = message.guild.id;
    const requestedChannels = args?.length
      ? extractChannelIdsFromArgs(args, message.guild)
      : [String(message.channel.id)];

    if (requestedChannels.length === 0) {
      return message.reply('Geçerli bir kanal bulunamadı. Kanal etiketleyin, ID girin veya kanal adını yazın.');
    }

    const { added, alreadyPresent } = await guildConfigService.addAllowedChannels(guildId, requestedChannels);

    if (added.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle('ℹ️ Kanal(lar) Zaten İzinli')
        .setDescription('Belirttiğin kanallar zaten izinli listesinde bulunuyor.')
        .setColor(0x3498db)
        .setTimestamp();

      const mentions = alreadyPresent
        .map((id) => ensureGuildChannel(id, message.guild))
        .filter(Boolean)
        .map((channel) => `<#${channel.id}>`)
        .join('\n');

      if (mentions) {
        embed.addFields({ name: 'İzinli Kanallar', value: mentions });
      }

      return message.reply({ embeds: [embed] });
    }

    const addedMentions = added
      .map((id) => ensureGuildChannel(id, message.guild))
      .filter(Boolean)
      .map((channel) => `<#${channel.id}>`)
      .join(', ');

    const embed = new EmbedBuilder()
      .setTitle('✅ Kanallar Eklendi')
      .setDescription(`Aşağıdaki kanallar izinli listesine eklendi: ${addedMentions}`)
      .setColor(0x2ecc71)
      .setTimestamp();

    if (alreadyPresent.length > 0) {
      const mentions = alreadyPresent
        .map((id) => ensureGuildChannel(id, message.guild))
        .filter(Boolean)
        .map((channel) => `<#${channel.id}>`)
        .join('\n');

      if (mentions) {
        embed.addFields({ name: 'Zaten İzinli', value: mentions });
      }
    }

    return message.reply({ embeds: [embed] });
  }
};

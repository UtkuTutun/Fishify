const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const guildConfigService = require('../../core/services/guild/guildConfigService');
const { extractChannelIdsFromArgs, ensureGuildChannel } = require('../../core/utils/channelParser');

module.exports = {
  name: 'kanalkaldır',
  description: 'Komutların kullanılabileceği kanallardan birini kaldırır (Yönetici yetkisi gerektirir)',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply('Bu komutu kullanmak için "Sunucuyu Yönet" yetkisine sahip olmalısın.');
    }

    const guildId = message.guild.id;
    const targetIds = args?.length
      ? extractChannelIdsFromArgs(args, message.guild)
      : [String(message.channel.id)];

    if (!targetIds.length) {
      return message.reply('Lütfen kaldırmak istediğin kanalı etiketle veya kanal ID/adını belirt.');
    }

    const { removed, notFound } = await guildConfigService.removeAllowedChannels(guildId, targetIds);

    if (removed.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle('ℹ️ Kanal Bulunamadı')
        .setDescription('Belirttiğin kanallar izinli listesinde bulunamadı.')
        .setColor(0x3498db)
        .setTimestamp();

      if (notFound.length > 0) {
        const mentions = notFound
          .map((id) => ensureGuildChannel(id, message.guild))
          .filter(Boolean)
          .map((channel) => `<#${channel.id}>`)
          .join('\n');
        if (mentions) {
          embed.addFields({ name: 'Kontrol Edilen Kanallar', value: mentions });
        }
      }

      return message.reply({ embeds: [embed] });
    }

    const removedMentions = removed
      .map((id) => ensureGuildChannel(id, message.guild))
      .filter(Boolean)
      .map((channel) => `<#${channel.id}>`)
      .join('\n') || removed.map((id) => `\`${id}\``).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('❌ Kanal(lar) Kaldırıldı')
      .setDescription('Aşağıdaki kanallar artık komut kullanımı için izinli değil:')
      .addFields({ name: 'Kaldırılan Kanallar', value: removedMentions })
      .setColor(0xe74c3c)
      .setTimestamp();

    if (notFound.length > 0) {
      const mentions = notFound
        .map((id) => ensureGuildChannel(id, message.guild))
        .filter(Boolean)
        .map((channel) => `<#${channel.id}>`)
        .join('\n');
      if (mentions) {
        embed.addFields({ name: 'Listede Zaten Yoktu', value: mentions });
      }
    }

    return message.reply({ embeds: [embed] });
  }
};

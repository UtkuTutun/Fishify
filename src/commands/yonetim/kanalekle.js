const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const guildConfigService = require('../../core/services/guild/guildConfigService');
const { extractChannelIdsFromArgs, ensureGuildChannel } = require('../../core/utils/channelParser');

module.exports = {
  name: 'kanalekle',
  description: 'Komutların kullanılabileceği bir kanal ekler (Yönetici yetkisi gerektirir)',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply('Bu komutu kullanmak için "Sunucuyu Yönet" yetkisine sahip olmalısın.');
    }

    const guildId = message.guild.id;
    const targetIds = args?.length
      ? extractChannelIdsFromArgs(args, message.guild)
      : [String(message.channel.id)];

    if (!targetIds.length) {
      return message.reply('Geçerli bir kanal bulunamadı. Kanal etiketleyin, ID girin veya kanal adını yazın.');
    }

    const { added, alreadyPresent } = await guildConfigService.addAllowedChannels(guildId, targetIds);

    if (added.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle('⚠️ Kanal Zaten İzinli')
        .setDescription('Belirttiğin tüm kanallar zaten izinli listesinde yer alıyor.')
        .setColor(0xe67e22)
        .setTimestamp();
      if (alreadyPresent.length > 0) {
        const mentions = alreadyPresent
          .map((id) => ensureGuildChannel(id, message.guild))
          .filter(Boolean)
          .map((channel) => `<#${channel.id}>`)
          .join('\n');
        if (mentions) {
          embed.addFields({ name: 'İzinli Kanallar', value: mentions });
        }
      }
      return message.reply({ embeds: [embed] });
    }

    const addedMentions = added
      .map((id) => ensureGuildChannel(id, message.guild))
      .filter(Boolean)
      .map((channel) => `<#${channel.id}>`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle('✅ Kanal(lar) Eklendi')
      .setDescription('Artık aşağıdaki kanallarda komut kullanılabilir:')
  .addFields({ name: 'Yeni Kanallar', value: addedMentions || added.map((id) => `\`${id}\``).join('\n') })
      .setColor(0x2ecc71)
      .setTimestamp();

    if (alreadyPresent.length > 0) {
      const alreadyMentions = alreadyPresent
        .map((id) => ensureGuildChannel(id, message.guild))
        .filter(Boolean)
        .map((channel) => `<#${channel.id}>`)
        .join('\n');
      if (alreadyMentions) {
        embed.addFields({ name: 'Zaten İzinli', value: alreadyMentions });
      }
    }

    return message.reply({ embeds: [embed] });
  }
};

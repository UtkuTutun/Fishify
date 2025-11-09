
const { prefix: defaultPrefix } = require('../../config');
const Guild = require('../../database/models/Guild');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;
    // Get prefix and allowed channels from DB or use default
    let guildPrefix = defaultPrefix;
    let allowedChannels = [];
    try {
      const guildData = await Guild.findOne({ guildId: message.guild.id });
      if (guildData) {
        if (guildData.prefix) guildPrefix = guildData.prefix;
        if (Array.isArray(guildData.allowedChannels)) allowedChannels = guildData.allowedChannels;
      }
    } catch (e) {
      // DB error, fallback to defaultPrefix
    }
    if (!message.content.startsWith(guildPrefix)) return;
    // Komut adını ve argümanları bir kez tanımla
    const args = message.content.slice(guildPrefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    const { alwaysAllowedCommands } = require('../../config');
    // Eğer sunucuda hiç kanal ekli değilse, sadece alwaysAllowedCommands komutlarına izin ver
    if (
      allowedChannels.length === 0 &&
      !alwaysAllowedCommands.includes(commandName)
    ) {
      const { EmbedBuilder } = require('discord.js');
      const embed = new EmbedBuilder()
        .setTitle('Komut Kullanılabilen Kanallar')
        .setDescription('Hiçbir kanal ekli değil. Lütfen bir kanal ekleyin!')
        .setColor(0x3498db);
      embed.setDescription(
        'Hiçbir kanal ekli değil. Lütfen bir kanal ekleyin!\n\n' +
        '**Kanal eklemek için:** `!kanalekle #kanal`\n' +
        '**Kimler ekleyebilir:** Sunucu yöneticileri'
      );
      embed.setFooter({ text: 'Komut Kullanılabilen Kanallar' });
      return message.reply({
        embeds: [embed]
      });
    }
    // Eğer komut alwaysAllowedCommands içinde değilse ve bu kanal izinli kanallar arasında yoksa, izin verme
    if (
      allowedChannels.length > 0 &&
      !allowedChannels.includes(String(message.channel.id)) &&
      !alwaysAllowedCommands.includes(commandName)
    ) {
      const { EmbedBuilder } = require('discord.js');
      let channelMentions = allowedChannels
        .map(id => {
          const ch = message.guild.channels.cache.get(id);
          return ch ? `<#${id}>` : null;
        })
        .filter(Boolean)
        .join('\n');
      if (!channelMentions) channelMentions = 'Hiçbir kanal bulunamadı.';
      const embed = new EmbedBuilder()
        .setTitle('Komut Kullanılabilen Kanallar')
        .setDescription(channelMentions)
        .setColor(0x3498db);
      return message.reply({
        content: 'Bu kanalda komut kullanılamaz. Sadece aşağıdaki kanallarda komut kullanabilirsin:',
        embeds: [embed]
      });
    }
    const command = client.commands.get(commandName);
    if (!command) return;
    try {
      await command.execute(message, args, client);
    } catch (error) {
      const logger = require('../utils/logger');
      await logger.error(error);
      message.reply('Bir hata oluştu!');
    }
  },
};

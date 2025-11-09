const { EmbedBuilder } = require('discord.js');

const config = require('../../config');
const { logCommand } = require('../services/commandLogger');
const logger = require('../utils/logger');
const guildConfigService = require('../services/guildConfigService');

const ALWAYS_ALLOWED = new Set(config.alwaysAllowedCommands.map((cmd) => cmd.toLowerCase()));

function buildNoChannelEmbed(prefix) {
  return new EmbedBuilder()
    .setTitle('Komut Kullanılabilen Kanallar')
    .setDescription(
      'Hiçbir kanal ekli değil. Lütfen bir kanal ekleyin!\n\n' +
      `**Kanal eklemek için:** \`${prefix}kanalekle #kanal\`\n` +
      '**Kimler ekleyebilir:** Sunucu yöneticileri'
    )
    .setColor(0x3498db)
    .setFooter({ text: 'Komut Kullanılabilen Kanallar' });
}

function buildChannelListEmbed(message, allowedChannels) {
  const channelMentions = allowedChannels
    .map((id) => {
      const channel = message.guild.channels.cache.get(id);
      return channel ? `<#${id}>` : null;
    })
    .filter(Boolean)
    .join('\n') || 'Hiçbir kanal bulunamadı.';

  return new EmbedBuilder()
    .setTitle('Komut Kullanılabilen Kanallar')
    .setDescription(channelMentions)
    .setColor(0x3498db);
}

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) {
      return;
    }

    const { prefix, allowedChannels } = await guildConfigService.getGuildSettings(message.guild.id);

    if (!message.content.startsWith(prefix)) {
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) {
      return;
    }

    if (allowedChannels.length === 0 && !ALWAYS_ALLOWED.has(commandName)) {
      const embed = buildNoChannelEmbed(prefix);
      await message.reply({ embeds: [embed] });
      return;
    }

    if (
      allowedChannels.length > 0 &&
      !allowedChannels.includes(String(message.channel.id)) &&
      !ALWAYS_ALLOWED.has(commandName)
    ) {
      const embed = buildChannelListEmbed(message, allowedChannels);
      await message.reply({
        content: 'Bu kanalda komut kullanılamaz. Sadece aşağıdaki kanallarda komut kullanabilirsin:',
        embeds: [embed]
      });
      return;
    }

    const command = client.commands.get(commandName);
    if (!command) {
      return;
    }

    try {
      await logCommand({
        client,
        user: message.author,
        command: commandName,
        args,
        guild: message.guild,
        channel: message.channel
      });

      await command.execute(message, args, client);
    } catch (error) {
      await logger.error(error);
      await message.reply('Bir hata oluştu!');
    }
  }
};

const path = require("path");
const { EmbedBuilder } = require("discord.js");

const guildConfigService = require('../../core/services/guildConfigService');



// Komutun dosya yolundan kategorisini bulmak için yardımcı fonksiyon
function getCategoryFromPath(command) {
  if (!command || !command.__path) return 'Diğer';
  const parts = command.__path.split(path.sep);
  const idx = parts.lastIndexOf('commands');
  if (idx !== -1 && parts.length > idx + 1) {
    return parts[idx + 1];
  }
  return 'Diğer';
}

module.exports = {
  name: "komutlar",
  description: "Tüm komutları ve açıklamalarını listeler.",
  async execute(message, args, client) {
    const { prefix } = await guildConfigService.getGuildSettings(message.guild.id);
    // Komutlar client.commands koleksiyonunda
    const commands = Array.from(client.commands.values());
    // Kategorilere göre grupla
    const categories = {};
    for (const cmd of commands) {
      // Komutun dosya yolunu bulmak için, yükleyicide __path atanmalı
      const category = getCategoryFromPath(cmd);
      if (!categories[category]) categories[category] = [];
      categories[category].push(cmd);
    }
    let desc = "";
    for (const [cat, cmds] of Object.entries(categories)) {
      desc += `__**${cat.charAt(0).toUpperCase() + cat.slice(1)} Komutları**__\n`;
      for (const cmd of cmds) {
        desc += `• **${prefix}${cmd.name}**: ${cmd.description}\n`;
      }
      desc += "\n";
    }
    if (!desc.trim()) desc = 'Komut bulunamadı.';
    const embed = new EmbedBuilder()
      .setTitle("📜 Kullanılabilir Komutlar")
      .setDescription(desc)
      .setColor(0x7289da)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  }
};

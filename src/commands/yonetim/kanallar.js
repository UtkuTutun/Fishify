const Guild = require("../../database/models/Guild");

module.exports = {
  name: "kanallar",
  description: "İzinli kanalların listesini gösterir.",
  async execute(message) {
    let guild = await Guild.findOne({ guildId: message.guild.id });
    if (!guild || !guild.allowedChannels || guild.allowedChannels.length === 0) {
      return message.reply("Bu sunucuda izinli kanal ayarlanmamış. Tüm kanallarda komut kullanılabilir.");
    }
    const channelMentions = guild.allowedChannels.map(id => `<#${id}>`).join("\n");
    message.reply(`İzinli kanallar:\n${channelMentions}`);
  }
};

const Guild = require("../../database/models/Guild");

module.exports = {
  name: "kanalseç",
  description: "Mevcut kanalı veya belirtilen kanalları izinli kanallar listesine ekler (Yönetici yetkisi gerektirir)",
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) {
      return message.reply("Bu komutu kullanmak için 'Sunucuyu Yönet' yetkisine sahip olmalısın.");
    }
    let channelIds = [];
    if (args.length === 0) {
      channelIds.push(String(message.channel.id));
    } else {
      for (const arg of args) {
        // Kanal etiketini veya ID'yi destekle
        const match = arg.match(/^<#!?(\d+)>$/);
        if (match) {
          channelIds.push(String(match[1]));
        } else if (/^\d+$/.test(arg)) {
          channelIds.push(String(arg));
        } else {
          // Kanal adı ile de eklemeye çalış
          const found = message.guild.channels.cache.find(c => c.name === arg);
          if (found) channelIds.push(String(found.id));
        }
      }
    }
    // Benzersizleştir
    channelIds = [...new Set(channelIds)];
    if (channelIds.length === 0) {
      return message.reply("Geçerli bir kanal bulunamadı. Kanal etiketleyin, ID girin veya kanal adını yazın.");
    }
    let guild = await Guild.findOne({ guildId: message.guild.id });
    if (!guild) {
      guild = new Guild({ guildId: message.guild.id });
    }
    let newlyAdded = [];
    for (const id of channelIds) {
      if (!guild.allowedChannels.includes(id)) {
        guild.allowedChannels.push(id);
        newlyAdded.push(id);
      }
    }
    await guild.save();
    if (newlyAdded.length === 0) {
      return message.reply("Belirtilen kanallar zaten izinli kanallar arasında.");
    }
    const mentions = newlyAdded.map(id => `<#${id}>`).join(", ");
    message.reply(`Aşağıdaki kanallar izinli kanallar listesine eklendi: ${mentions}`);
  }
};

const Guild = require("../../database/models/Guild");

module.exports = {
  name: "kanalekle",
  description: "Komutların kullanılabileceği bir kanal ekler (Yönetici yetkisi gerektirir)",
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) {
      return message.reply("Bu komutu kullanmak için 'Sunucuyu Yönet' yetkisine sahip olmalısın.");
    }
    let channel;
    if (!args[0]) {
      channel = message.channel;
    } else {
      channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    }
    if (!channel) {
      return message.reply("Lütfen eklemek istediğiniz kanalı etiketleyin veya kanal ID'sini girin. Örnek: `!kanalekle #kanal` veya `!kanalekle 1234567890`");
    }
    let guild = await Guild.findOne({ guildId: message.guild.id });
    if (!guild) {
      guild = new Guild({ guildId: message.guild.id });
    }
    const channelIdStr = String(channel.id);
    if (guild.allowedChannels.includes(channelIdStr)) {
      return message.reply("Bu kanal zaten izinli kanallar arasında.");
    }
    guild.allowedChannels.push(channelIdStr);
    await guild.save();
    message.reply(`✅ <#${channelIdStr}> kanalı başarıyla izinli kanallar listesine eklendi.`);
  }
};

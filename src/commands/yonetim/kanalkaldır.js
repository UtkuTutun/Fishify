const Guild = require("../../database/models/Guild");

module.exports = {
  name: "kanalkaldır",
  description: "Komutların kullanılabileceği kanallardan birini kaldırır (Yönetici yetkisi gerektirir)",
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
      return message.reply("Lütfen kaldırmak istediğiniz kanalı etiketleyin veya kanal ID'sini girin. Örnek: `!kanalkaldır #kanal` veya `!kanalkaldır 1234567890`");
    }
    let guild = await Guild.findOne({ guildId: message.guild.id });
    const channelIdStr = String(channel.id);
    if (!guild || !guild.allowedChannels.includes(channelIdStr)) {
      return message.reply("Bu kanal zaten izinli kanallar arasında değil.");
    }
    guild.allowedChannels = guild.allowedChannels.filter(id => id !== channelIdStr);
    await guild.save();
    message.reply(`❌ <#${channelIdStr}> kanalı izinli kanallar listesinden kaldırıldı.`);
  }
};

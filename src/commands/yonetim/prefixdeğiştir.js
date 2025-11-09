const Guild = require("../../database/models/Guild");

module.exports = {
  name: "prefixdeğiştir",
  description: "Sunucu prefixini değiştirir (Yönetici yetkisi gerektirir)",
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) {
      return message.reply("Bu komutu kullanmak için 'Sunucuyu Yönet' yetkisine sahip olmalısın.");
    }
    const newPrefix = args[0];
    if (!newPrefix || newPrefix.length > 3) {
      return message.reply("Lütfen 1-3 karakter uzunluğunda yeni bir prefix girin. Örnek: `!prefixdeğiştir ?`");
    }
    let guild = await Guild.findOne({ guildId: message.guild.id });
    if (!guild) {
      guild = new Guild({ guildId: message.guild.id });
    }
    guild.prefix = newPrefix;
    await guild.save();
  await message.reply(`Prefix başarıyla değiştirildi! Yeni prefix: \`${newPrefix}\``);
  }
};

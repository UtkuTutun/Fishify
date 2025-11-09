const User = require("../../database/models/User");
const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {
  name: "profil",
  description: "Kullanıcının oyun profilini ve istatistiklerini gösterir.",
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    let user = await User.findOne({ userId: target.id });
    if (!user) {
      const embed = new EmbedBuilder()
        .setTitle('❗ Kullanıcı Bulunamadı')
        .setDescription('Bu kullanıcı sisteme kayıtlı değil.')
        .setColor(0xe74c3c)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }
    const created = `<t:${Math.floor(new Date(user.createdAt).getTime()/1000)}:F>`;
    const embed = new EmbedBuilder()
      .setTitle(`👤 ${target.username} | Oyun Profili`)
      .setColor(0x3498db)
      .addFields(
        { name: 'Kayıt Tarihi', value: created, inline: true },
        { name: 'Bakiye', value: `${user.balance}${config.currency.icon}`, inline: true },
        { name: 'Toplam Balık', value: `${user.totalFishCount} balık`, inline: true },
        { name: 'Toplam Balık Kg', value: `${user.totalFishKg.toFixed(2)} kg`, inline: true }
      )
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  }
};

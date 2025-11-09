const User = require("../../database/models/User");
const formatPrice = require("../../core/utils/formatPrice");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "bakiye",
  description: "Kendi veya etiketlenen kullanıcının bakiyesini gösterir.",
  async execute(message, args) {
    let target = message.mentions.users.first() || message.author;
    let user = await User.findOne({ userId: target.id });
    if (!user) {
      user = new User({ userId: target.id, balance: 0 });
      await user.save();
    }
    const embed = new EmbedBuilder()
      .setTitle("💳 Bakiye Bilgisi")
      .setDescription(`**${target.username}** kullanıcısının bakiyesi: **${formatPrice(user.balance)}**`)
      .setColor(0x2ecc71)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  }
};

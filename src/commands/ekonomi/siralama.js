const User = require("../../database/models/User");
const formatPrice = require("../../core/utils/formatPrice");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "siralama",
  description: "En yüksek bakiyeye sahip kullanıcıları sıralar.",
  async execute(message) {
    const users = await User.find().sort({ balance: -1 }).limit(10);
    let desc = users.length
      ? users.map((u, i) => `**${i + 1}.** <@${u.userId}> - ${formatPrice(u.balance)}`).join("\n")
      : "Hiç veri yok.";
    const embed = new EmbedBuilder()
      .setTitle("🏆 En Zenginler Sıralaması")
      .setDescription(desc)
      .setColor(0xf1c40f)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  }
};

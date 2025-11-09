const rarities = require("../../data/rarities");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "rarities",
  description: "Tüm balık nadirliklerini ve özelliklerini gösterir.",
  async execute(message) {
    const embed = new EmbedBuilder()
      .setTitle("Balık Nadirlikleri ve Özellikleri")
      .setColor(0x3498db)
      .setTimestamp();

    for (const key in rarities) {
      const r = rarities[key];
      embed.addFields({
        name: `${r.emoji} ${r.name}`,
        value:
          `Renk kodu: #${r.color.toString(16).padStart(6, "0").toUpperCase()}` +
          (typeof r.chance === 'number' ? `\nŞans: %${(r.chance * 100).toFixed(1)}` : ""),
        inline: false
      });
    }

    await message.reply({ embeds: [embed] });
  }
};

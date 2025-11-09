const fishes = require('../../data/fishes');
const { EmbedBuilder } = require('discord.js');
const formatKg = require('../../core/utils/formatKg');
const formatPrice = require('../../core/utils/formatPrice');

module.exports = {
  name: "baliklar",
  description: "Tüm balıkları ve özelliklerini listeler.",
  async execute(message) {
    const embed = new EmbedBuilder()
      .setTitle("🎣 Tüm Balıklar ve Özellikleri")
      .setColor(0x1e90ff)
      .setTimestamp();
    for (const fish of fishes) {
      embed.addFields({
        name: `${fish.emoji} ${fish.name} (${fish.rarity.emoji} ${fish.rarity.name})`,
        value:
          `Açıklama: ${fish.description}\n` +
          `Ağırlık: ${formatKg(fish.kgRange[0])} - ${formatKg(fish.kgRange[1])}\n` +
          `Fiyat: Baz ${formatPrice(fish.price.base)} + kg başı ${formatPrice(fish.price.perKg)}\n` +
          `Yakalanma Şansı: %${(fish.chance * 100).toFixed(1)}`,
        inline: false
      });
    }
    await message.reply({ embeds: [embed] });
  }
};

// !fish komutu: Kullanıcı balık tutar, rastgele bir balık yakalar

const { EmbedBuilder } = require('discord.js');

const formatPrice = require('../../core/utils/formatPrice');
const formatKg = require('../../core/utils/formatKg');
const fishingService = require('../../core/services/fishing/fishingService');
const { logFishCatch } = require('../../core/services/fishLogger');
const logger = require('../../core/utils/logger');

module.exports = {
  name: 'fish',
  description: 'Balık tut!',
  async execute(message) {
    try {
      const result = await fishingService.processCatch(message.author.id);
      const { fish, rarity, kg, reward, user } = result;

      const embed = new EmbedBuilder()
        .setTitle('Balık Avı Sonucu')
        .addFields(
          {
            name: '🐟 Balık Bilgisi',
            value: `> ${fish.emoji || '🎣'} **${fish.name}**\n> ${rarity.emoji} *${rarity.name}*\n> _${fish.description}_`
          },
          { name: '⚖️ Ağırlık', value: formatKg(kg), inline: true },
          { name: '💰 Kazanç', value: formatPrice(reward.total), inline: true },
          {
            name: '🧾 Fiyat Detayı',
            value:
              `Baz: ${formatPrice(reward.base)}\n` +
              `Kg başı: ${formatPrice(reward.perKg)} x ${formatKg(kg)} = ${formatPrice(reward.kgPrice)}\n` +
              `Toplam: ${formatPrice(reward.total)}`
          },
          { name: '💳 Yeni Bakiyen', value: formatPrice(user.balance), inline: true }
        )
        .setColor(rarity.color || 0x1e90ff)
        .setTimestamp();

      await message.reply({ embeds: [embed] });

      await logFishCatch({
        client: message.client,
        user: message.author,
        guild: message.guild,
        channel: message.channel,
        fish,
        amount: 1,
        kg,
        total: reward.total,
        time: new Date()
      });
    } catch (error) {
      await logger.error(error);
      await message.reply('Balık tutarken bir hata oluştu. Lütfen daha sonra tekrar dene.');
    }
  }
};

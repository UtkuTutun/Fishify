const { EmbedBuilder } = require('discord.js');

const formatPrice = require('../../core/utils/formatPrice');
const economyService = require('../../core/services/economy/economyService');

module.exports = {
  name: 'siralama',
  description: 'En yüksek bakiyeye sahip kullanıcıları sıralar.',
  async execute(message) {
    const users = await economyService.getLeaderboard(10);
    const description = users.length
      ? users
          .map((user, index) => `**${index + 1}.** <@${user.userId}> - ${formatPrice(user.balance || 0)}`)
          .join('\n')
      : 'Hiç veri yok.';

    const embed = new EmbedBuilder()
      .setTitle('🏆 En Zenginler Sıralaması')
      .setDescription(description)
      .setColor(0xf1c40f)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};

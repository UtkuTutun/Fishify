const { EmbedBuilder } = require('discord.js');

const formatPrice = require('../../core/utils/formatPrice');
const economyService = require('../../core/services/economy/economyService');

module.exports = {
  name: 'bakiye',
  description: 'Kendi veya etiketlenen kullanıcının bakiyesini gösterir.',
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const user = await economyService.getOrCreateUser(target.id);

    const embed = new EmbedBuilder()
      .setTitle('💳 Bakiye Bilgisi')
      .setDescription(`**${target.tag}** kullanıcısının bakiyesi: **${formatPrice(user.balance)}**`)
      .setColor(0x2ecc71)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};

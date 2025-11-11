const { EmbedBuilder } = require('discord.js');

const economyService = require('../../core/services/economy/economyService');
const formatPrice = require('../../core/utils/formatPrice');
const formatKg = require('../../core/utils/formatKg');

module.exports = {
  name: 'profil',
  description: 'Kullanıcının oyun profilini ve istatistiklerini gösterir.',
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const user = await economyService.getProfile(target.id);

    if (!user) {
      const embed = new EmbedBuilder()
        .setTitle('❗ Kullanıcı Bulunamadı')
        .setDescription('Bu kullanıcı sisteme kayıtlı değil. Önce oyun içerisinde bir işlem yapması gerekir.')
        .setColor(0xe74c3c)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    const createdTimestamp = Math.floor(new Date(user.createdAt).getTime() / 1000);
    const embed = new EmbedBuilder()
      .setTitle(`👤 ${target.tag} | Oyun Profili`)
      .setColor(0x3498db)
      .addFields(
        { name: 'Kayıt Tarihi', value: `<t:${createdTimestamp}:F>`, inline: true },
        { name: 'Bakiye', value: formatPrice(user.balance || 0), inline: true },
        { name: 'Toplam Balık', value: `${user.totalFishCount || 0} balık`, inline: true },
        { name: 'Toplam Balık Kg', value: formatKg(user.totalFishKg || 0), inline: true }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};

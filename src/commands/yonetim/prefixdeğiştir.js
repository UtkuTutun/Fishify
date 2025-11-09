const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const guildConfigService = require('../../core/services/guildConfigService');

module.exports = {
  name: 'prefixdeğiştir',
  description: 'Sunucu prefixini değiştirir (Yönetici yetkisi gerektirir)',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply('Bu komutu kullanmak için "Sunucuyu Yönet" yetkisine sahip olmalısın.');
    }

    const rawPrefix = args?.[0]?.trim();
    if (!rawPrefix) {
      return message.reply('Lütfen yeni prefix değerini gir. Örnek: `!prefixdeğiştir ?`');
    }

    if (rawPrefix.length > 5) {
      return message.reply('Prefix en fazla 5 karakter olabilir.');
    }

    if (/\s/.test(rawPrefix)) {
      return message.reply('Prefix içerisinde boşluk kullanamazsın.');
    }

    await guildConfigService.setPrefix(message.guild.id, rawPrefix);

    const embed = new EmbedBuilder()
      .setTitle('✅ Prefix Güncellendi')
      .setDescription(`Yeni prefix: \`${rawPrefix}\`
Değişiklik hemen geçerli olacaktır.`)
      .setColor(0x2ecc71)
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
};

// Para gönderim log fonksiyonu
const { EmbedBuilder } = require('discord.js');
const { moneyTransferLogChannelId } = require('../../config/channels');
const logger = require('../utils/logger');

async function resolveMoneyLogChannel(client) {
  if (!moneyTransferLogChannelId) {
    return null;
  }

  const cachedChannel = client.channels.cache.get(moneyTransferLogChannelId);
  if (cachedChannel) {
    return cachedChannel;
  }

  try {
    return await client.channels.fetch(moneyTransferLogChannelId);
  } catch (error) {
    await logger.warn('Para transfer log kanalı alınamadı veya erişim yok.');
    await logger.debug(error);
    return null;
  }
}

async function logMoneyTransfer(client, sender, receiver, amount, senderBalance, receiverBalance) {
  const channel = await resolveMoneyLogChannel(client);
  if (!channel) {
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('💸 Para Transfer Logu')
    .setDescription(`**${sender.username}** kullanıcısı **${receiver.username}** kullanıcısına ${amount}₺ gönderdi.`)
    .addFields(
      { name: 'Gönderen Bakiyesi', value: `${senderBalance}₺`, inline: true },
      { name: 'Alıcı Bakiyesi', value: `${receiverBalance}₺`, inline: true }
    )
    .setTimestamp()
    .setColor(0x3498db);

  try {
    await channel.send({ embeds: [embed] });
  } catch (error) {
    await logger.warn('Para transfer logu kanala gönderilemedi.');
    await logger.debug(error);
  }
}

module.exports = logMoneyTransfer;

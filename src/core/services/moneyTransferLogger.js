// Para gönderim log fonksiyonu
const { EmbedBuilder } = require("discord.js");
const channels = require("../../config/channels");

async function logMoneyTransfer(client, sender, receiver, amount, senderBalance, receiverBalance) {
  const channelId = channels.moneyTransferLogChannelId;
  if (!channelId) return;
  const channel = await client.channels.fetch(channelId).catch(() => null);
  if (!channel) return;
  const embed = new EmbedBuilder()
    .setTitle("💸 Para Transfer Logu")
    .setDescription(`**${sender.username}** kullanıcısı **${receiver.username}** kullanıcısına ${amount}₺ gönderdi.`)
    .addFields(
      { name: "Gönderen Bakiyesi", value: `${senderBalance}₺`, inline: true },
      { name: "Alıcı Bakiyesi", value: `${receiverBalance}₺`, inline: true }
    )
    .setTimestamp()
    .setColor(0x3498db);
  channel.send({ embeds: [embed] });
}

module.exports = logMoneyTransfer;

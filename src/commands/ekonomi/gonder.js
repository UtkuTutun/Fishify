const User = require("../../database/models/User");
const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const ms = require("ms");

// Basit bir transfer limiti için kullanıcıya özel günlük sayaç
const transferCache = new Map(); // { userId: { amount, lastReset } }

function getTurkeyMidnight() {
  // Türkiye saati UTC+3
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const turkey = new Date(utc + 3 * 60 * 60 * 1000);
  turkey.setHours(config.dailyTransferResetHour, 0, 0, 0);
  if (turkey < now) turkey.setDate(turkey.getDate() + 1);
  return turkey;
}

const configLimitText = `Bir kullanıcıya bakiye gönder. (Günlük limit: ${config.dailyTransferLimit}${config.currency.icon})`;
module.exports = {
  name: "gonder",
  description: configLimitText,
  async execute(message, args) {
    const amount = Number(args[1]);
    const target = message.mentions.users.first();
    if (!target || isNaN(amount) || amount <= 0) {
      const embed = new EmbedBuilder()
        .setTitle('❗ Hatalı Kullanım')
        .setDescription('Kullanım: `!gonder @kullanıcı miktar`')
        .setColor(0xe74c3c)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }
    if (target.id === message.author.id) {
      const embed = new EmbedBuilder()
        .setTitle('❗ Hatalı İşlem')
        .setDescription('Kendine bakiye gönderemezsin.')
        .setColor(0xe74c3c)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }
    // Limit kontrolü
    const now = Date.now();
    let cache = transferCache.get(message.author.id);
    const resetTime = getTurkeyMidnight().getTime();
    if (!cache || cache.lastReset < resetTime - 24 * 60 * 60 * 1000) {
      cache = { amount: 0, lastReset: resetTime };
    }
    if (cache.lastReset < now) {
      cache.amount = 0;
      cache.lastReset = resetTime;
    }
    if (cache.amount + amount > config.dailyTransferLimit) {
      const resetDate = new Date(cache.lastReset);
      const embed = new EmbedBuilder()
        .setTitle('🚫 Günlük Limit Doldu')
        .setDescription(`Günlük gönderim limitini aştınız! (Limit: ${config.dailyTransferLimit}${config.currency.icon})`)
        .addFields({
          name: 'Limit Sıfırlanma Zamanı',
          value: `<t:${Math.floor(resetDate.getTime() / 1000)}:F> (Türkiye saati)`
        })
        .setColor(0xe67e22)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }
    // Kullanıcı bakiyeleri
    let sender = await User.findOne({ userId: message.author.id });
    let receiver = await User.findOne({ userId: target.id });
    if (!sender || sender.balance < amount) {
      const embed = new EmbedBuilder()
        .setTitle('❗ Yetersiz Bakiye')
        .setDescription('Yeterli bakiyen yok!')
        .setColor(0xe74c3c)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }
    if (!receiver) {
      const embed = new EmbedBuilder()
        .setTitle('❗ Kullanıcı Bulunamadı')
        .setDescription('Para göndermek istediğiniz kullanıcı sistemde kayıtlı değil. Kullanıcı önce bir işlem yapmalı veya sisteme kaydolmalı.')
        .setColor(0xe74c3c)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }
    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();
    cache.amount += amount;
    transferCache.set(message.author.id, cache);
    const embed = new EmbedBuilder()
      .setTitle("💸 Bakiye Transferi")
      .setDescription(`**${message.author.username}**, **${target.username}** kullanıcısına ${amount}${config.currency.icon} gönderdi!`)
      .setColor(0x2ecc71)
      .setTimestamp()
      .addFields(
        { name: "Kalan Bakiyen", value: `${sender.balance}${config.currency.icon}`, inline: true },
        { name: "Alıcının Yeni Bakiyesi", value: `${receiver.balance}${config.currency.icon}`, inline: true },
        { name: "Günlük Limit Kalan", value: `${config.dailyTransferLimit - cache.amount}${config.currency.icon}`, inline: true }
      );
    await message.reply({ embeds: [embed] });
  }
};

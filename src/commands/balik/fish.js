// !fish komutu: Kullanıcı balık tutar, rastgele bir balık yakalar

const fishes = require("../../data/fishes");
const User = require("../../database/models/User");
const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const formatPrice = require("../../core/utils/formatPrice");
const formatKg = require("../../core/utils/formatKg");


const rarities = require("../../data/rarities");

function getRandomFish() {
  // 1. rarity seçimi
  const rarityList = Object.values(rarities);
  const rarityRand = Math.random();
  let raritySum = 0;
  let selectedRarity = rarityList[0];
  for (const rarity of rarityList) {
    raritySum += rarity.chance;
    if (rarityRand <= raritySum) {
      selectedRarity = rarity;
      break;
    }
  }
  // 2. rarity içinden balık seçimi
  const fishesOfRarity = fishes.filter(f => f.rarity.name === selectedRarity.name);
  const fishRand = Math.random();
  let fishSum = 0;
  for (const fish of fishesOfRarity) {
    fishSum += fish.chance;
    if (fishRand <= fishSum) return fish;
  }
  // Güvenlik için: son balığı döndür
  return fishesOfRarity[fishesOfRarity.length - 1];
}

module.exports = {
  name: "fish",
  description: "Balık tut!",
  async execute(message, args) {
    const fish = getRandomFish();
    // Rastgele kilogram belirle
    const minKg = fish.kgRange[0];
    const maxKg = fish.kgRange[1];
    const kg = +(Math.random() * (maxKg - minKg) + minKg).toFixed(2);
    // Fiyat detayları
    const base = fish.price.base;
    const perKg = fish.price.perKg;
    const kgPrice = +(perKg * kg).toFixed(2);
    const total = +(base + kgPrice).toFixed(2);

    // Kullanıcıya para ekle ve istatistik güncelle
    let user = await User.findOne({ userId: message.author.id });
    if (!user) {
      user = new User({ userId: message.author.id, balance: 0, totalFishCount: 0, totalFishKg: 0 });
    }
    user.balance = +(user.balance + total).toFixed(2);
    user.totalFishCount = (user.totalFishCount || 0) + 1;
    user.totalFishKg = +(user.totalFishKg || 0) + kg;
    await user.save();

    const rarity = fish.rarity;
    const embed = new EmbedBuilder()
      .setTitle(`Balık Avı Sonucu`)
      .addFields(
  { name: "🐟 Balık Bilgisi", value: `> ${fish.emoji || "🎣"} **${fish.name}**\n> ${rarity.emoji} *${rarity.name}*\n> _${fish.description}_` },
  { name: "⚖️ Ağırlık", value: formatKg(kg), inline: true },
        { name: "💰 Kazanç", value: `${formatPrice(total)} (+${formatPrice(total)})`, inline: true },
    { name: "🧾 Fiyat Detayı", value:
      `Baz: ${formatPrice(base)}\nKg başı: ${formatPrice(perKg)} x ${formatKg(kg)} = ${formatPrice(kgPrice)}\nToplam: ${formatPrice(total)}` },
        { name: "💳 Yeni Bakiyen", value: `${formatPrice(user.balance)}` }
      )
      .setColor(rarity.color || 0x1e90ff)
      .setTimestamp();

    await message.reply({ embeds: [embed] });

    // Balık logunu özel kanala gönder
  const { logFishCatch } = require('../../core/services/fishLogger');
    logFishCatch({
      client: message.client || message.client || message.author.client || message.guild?.client || message.channel?.client || require('discord.js').client,
      user: message.author,
      guild: message.guild,
      channel: message.channel,
      fish,
      amount: 1,
      kg,
      total,
      time: new Date()
    });
  }
};

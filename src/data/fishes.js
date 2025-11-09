// Balık Tutma Oyunu için balık verileri
// Her balık: isim, nadirlik, değer, açıklama

const rarities = require("./rarities");
const fishes = [
  {
    name: "Hamsi",
    emoji: "🐟",
    rarity: rarities.yaygin,
    price: { base: 2, perKg: 5 },
    kgRange: [0.05, 0.2],
    description: "Küçük ama lezzetli bir balık.",
    chance: 0.35
  },
  {
    name: "Sazan",
    emoji: "🐠",
    rarity: rarities.yaygin,
    price: { base: 3, perKg: 8 },
    kgRange: [0.5, 3],
    description: "Tatlı su balıklarının en bilinenlerinden.",
    chance: 0.25
  },
  {
    name: "Levrek",
    emoji: "🐡",
    rarity: rarities.yaygin,
    price: { base: 4, perKg: 10 },
    kgRange: [0.3, 2],
    description: "Denizlerin hızlı avcısı.",
    chance: 0.2
  },
  {
    name: "Turna",
    emoji: "🎣",
    rarity: rarities.nadir,
    price: { base: 10, perKg: 25 },
    kgRange: [1, 7],
    description: "Uzun ve yırtıcı bir balık.",
    chance: 0.12
  },
  {
    name: "Alabalık",
    emoji: "🦈",
    rarity: rarities.nadir,
    price: { base: 12, perKg: 30 },
    kgRange: [0.2, 1.5],
    description: "Soğuk suların gözdesi.",
    chance: 0.08
  }
];

module.exports = fishes;

const fishes = require('../../../data/fishes');
const rarities = require('../../../data/rarities');

const economyService = require('../economy/economyService');
const { roundCurrency } = require('../utils/currency');

function buildRarityTable() {
  const list = Object.values(rarities);
  return list.map((rarity, index) => {
    const cumulative = list.slice(0, index + 1).reduce((sum, item) => sum + (item.chance || 0), 0);
    return { rarity, cumulative };
  });
}

const rarityTable = buildRarityTable();

function selectRarity(randomValue = Math.random()) {
  for (const entry of rarityTable) {
    if (randomValue <= entry.cumulative) {
      return entry.rarity;
    }
  }
  return rarityTable[rarityTable.length - 1].rarity;
}

function getFishPool(rarity) {
  return fishes.filter((fish) => fish.rarity?.name === rarity.name);
}

function selectFish(pool, randomValue = Math.random()) {
  if (!pool.length) {
    return null;
  }
  let cumulative = 0;
  for (const fish of pool) {
    cumulative += fish.chance || 0;
    if (randomValue <= cumulative) {
      return fish;
    }
  }
  return pool[pool.length - 1];
}

function randomKg([minKg, maxKg]) {
  const clampedMin = Math.max(0, Number(minKg));
  const clampedMax = Math.max(clampedMin, Number(maxKg));
  const value = Math.random() * (clampedMax - clampedMin) + clampedMin;
  return Math.round(value * 100) / 100;
}

function calculateReward(fish, kg) {
  const base = Number(fish.price?.base) || 0;
  const perKg = Number(fish.price?.perKg) || 0;
  const kgPrice = Math.round(perKg * kg * 100) / 100;
  const total = Math.round((base + kgPrice) * 100) / 100;
  return {
    base,
    perKg,
    kgPrice,
    total
  };
}

async function applyCatchToUser(userId, kg, rewardTotal) {
  const user = await economyService.getOrCreateUser(userId);
  user.balance = economyService.roundCurrency(user.balance + rewardTotal);
  user.totalFishCount = (user.totalFishCount || 0) + 1;
  const totalKg = Number(user.totalFishKg || 0) + kg;
  user.totalFishKg = Math.round(totalKg * 100) / 100;
  await user.save();
  return user;
}

async function processCatch(userId) {
  const rarity = selectRarity();
  const pool = getFishPool(rarity);
  const fish = selectFish(pool);
  if (!fish) {
    throw new Error('Uygun balık bulunamadı.');
  }

  const kg = randomKg(fish.kgRange || [0.1, 1]);
  const reward = calculateReward(fish, kg);
  const user = await applyCatchToUser(userId, kg, reward.total);

  return {
    user,
    fish,
    rarity,
    kg,
    reward
  };
}

module.exports = {
  processCatch,
  randomKg,
  calculateReward
};

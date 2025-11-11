const config = require('../../../config');
const User = require('../../../database/models/User');
const TransferDailyStat = require('../../../database/models/TransferDailyStat');

const logger = require('../../utils/logger');
const { getCurrencyIcon, roundCurrency } = require('../../utils/currency');

const TOTAL_RECEIVER_ID = '__TOTAL__';
const TURKEY_TZ = 'Europe/Istanbul';

function getTransferSettings() {
  return config.economy?.transfer || {};
}

function createDateInTimeZone(date = new Date()) {
  const localized = new Date(date.toLocaleString('en-US', { timeZone: TURKEY_TZ }));
  return localized;
}

function getDayKey(date = new Date()) {
  const settings = getTransferSettings();
  const resetHour = Number.isFinite(settings.resetHour) ? settings.resetHour : 0;
  const localized = createDateInTimeZone(date);
  localized.setHours(localized.getHours() - resetHour, localized.getMinutes(), localized.getSeconds(), localized.getMilliseconds());
  const year = localized.getFullYear();
  const month = String(localized.getMonth() + 1).padStart(2, '0');
  const day = String(localized.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getOrCreateUser(userId) {
  let user = await User.findOne({ userId });
  if (!user) {
    user = await User.create({ userId });
  }
  return user;
}

async function incrementDailyStat(senderId, receiverId, dayKey, amount) {
  const update = { $inc: { amount: amount } };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  return TransferDailyStat.findOneAndUpdate({ senderId, receiverId, dayKey }, update, options).lean().exec();
}

async function getDailyStat(senderId, receiverId, dayKey) {
  const stat = await TransferDailyStat.findOne({ senderId, receiverId, dayKey }).lean().exec();
  return stat?.amount || 0;
}

async function getDailyTotals(senderId, receiverId, dayKey) {
  const [pair, total] = await Promise.all([
    getDailyStat(senderId, receiverId, dayKey),
    getDailyStat(senderId, TOTAL_RECEIVER_ID, dayKey)
  ]);
  return { pair, total };
}

async function updateDailyTotals(senderId, receiverId, dayKey, amount) {
  await Promise.all([
    incrementDailyStat(senderId, receiverId, dayKey, amount),
    incrementDailyStat(senderId, TOTAL_RECEIVER_ID, dayKey, amount)
  ]);
}

async function transferBalance({ senderId, receiverId, amount }) {
  const settings = getTransferSettings();
  if (!settings.enabled) {
    throw new Error('Transfer özelliği devre dışı.');
  }

  const numericAmount = roundCurrency(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Geçerli bir transfer tutarı belirtmelisin.');
  }

  if (senderId === receiverId) {
    throw new Error('Kendine para gönderemezsin.');
  }

  const feeRate = Number(settings.fee) || 0;
  const feeAmount = roundCurrency(numericAmount * feeRate);
  const totalDebit = roundCurrency(numericAmount + feeAmount);

  const [sender, receiver] = await Promise.all([
    getOrCreateUser(senderId),
    getOrCreateUser(receiverId)
  ]);

  if (sender.balance < totalDebit) {
    throw new Error('Yeterli bakiyen yok.');
  }

  const dayKey = getDayKey();
  const { pair, total } = await getDailyTotals(senderId, receiverId, dayKey);

  const maxTotal = Number(settings.dailyTotalLimit) || 0;
  if (maxTotal > 0 && roundCurrency(total + numericAmount) > maxTotal) {
    throw new Error('Günlük toplam gönderim limitini aştın.');
  }

  const maxPerUser = Number(settings.dailyLimitPerUser) || 0;
  if (maxPerUser > 0 && roundCurrency(pair + numericAmount) > maxPerUser) {
    throw new Error('Belirtilen kullanıcıya günlük limit kadar para gönderdin.');
  }

  sender.balance = roundCurrency(sender.balance - totalDebit);
  receiver.balance = roundCurrency(receiver.balance + numericAmount);

  await Promise.all([sender.save(), receiver.save(), updateDailyTotals(senderId, receiverId, dayKey, numericAmount)]);

  await logger.info(
    `[TRANSFER] ${senderId} -> ${receiverId} | amount=${numericAmount} fee=${feeAmount} totalDebit=${totalDebit}`
  );

  return {
    sender,
    receiver,
    amount: numericAmount,
    fee: feeAmount,
    totalDebit,
    currencyIcon: getCurrencyIcon(),
    dayKey,
    dailyTotals: {
      pair: roundCurrency(pair + numericAmount),
      total: roundCurrency(total + numericAmount)
    },
    limits: {
      dailyTotalLimit: maxTotal,
      dailyLimitPerUser: maxPerUser
    }
  };
}

async function getLeaderboard(limit = 10) {
  const capped = Math.max(1, Math.min(limit, 50));
  const users = await User.find().sort({ balance: -1 }).limit(capped).lean().exec();
  return users;
}

async function getProfile(userId) {
  const user = await User.findOne({ userId }).lean().exec();
  return user;
}

async function awardBalance(userId, amount) {
  const numericAmount = roundCurrency(amount);
  if (!Number.isFinite(numericAmount)) {
    throw new Error('Geçersiz bakiye değeri.');
  }

  const user = await getOrCreateUser(userId);
  user.balance = roundCurrency(user.balance + numericAmount);
  await user.save();
  return user;
}

function getNextResetDate(reference = new Date()) {
  const settings = getTransferSettings();
  const resetHour = Number.isFinite(settings.resetHour) ? settings.resetHour : 0;
  const localizedNow = createDateInTimeZone(reference);
  const candidate = new Date(localizedNow.getTime());
  candidate.setHours(resetHour, 0, 0, 0);
  if (candidate <= localizedNow) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

function getTransferSettingsSnapshot() {
  const settings = getTransferSettings();
  return {
    enabled: Boolean(settings.enabled),
    dailyTotalLimit: Number(settings.dailyTotalLimit) || 0,
    dailyLimitPerUser: Number(settings.dailyLimitPerUser) || 0,
    fee: Number(settings.fee) || 0,
    resetHour: Number.isFinite(settings.resetHour) ? settings.resetHour : 0
  };
}

module.exports = {
  getOrCreateUser,
  transferBalance,
  getLeaderboard,
  getProfile,
  awardBalance,
  getCurrencyIcon,
  roundCurrency,
  getNextResetDate,
  getTransferSettingsSnapshot
};

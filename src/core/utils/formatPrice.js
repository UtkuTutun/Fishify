const config = require('../../config');

function getCurrencyIcon() {
  if (config.economy?.currency?.icon) {
    return config.economy.currency.icon;
  }
  if (config.currency?.icon) {
    return config.currency.icon;
  }
  return '₺';
}

function formatPrice(amount) {
  const value = Number(amount);
  const safeAmount = Number.isFinite(value) ? value : 0;
  const icon = getCurrencyIcon();
  return `${safeAmount.toFixed(2)} ${icon}`;
}

module.exports = formatPrice;

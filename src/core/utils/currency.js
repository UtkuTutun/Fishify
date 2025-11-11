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

function roundCurrency(value) {
  return Math.round(Number(value) * 100) / 100;
}

module.exports = {
  getCurrencyIcon,
  roundCurrency
};

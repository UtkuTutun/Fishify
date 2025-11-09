const config = require("../../config");


function formatPrice(amount) {
  let icon = '₺';
  if (config.economy && config.economy.currency && config.economy.currency.icon) {
    icon = config.economy.currency.icon;
  } else if (config.currency && config.currency.icon) {
    icon = config.currency.icon;
  }
  return `${amount.toFixed(2)} ${icon}`;
}

module.exports = formatPrice;

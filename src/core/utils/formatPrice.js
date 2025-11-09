const config = require("../../config");

function formatPrice(amount) {
  return `${amount.toFixed(2)} ${config.currency.icon}`;
}

module.exports = formatPrice;

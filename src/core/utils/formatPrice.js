
const { getCurrencyIcon } = require('./currency');

function formatPrice(amount) {
  const value = Number(amount);
  const safeAmount = Number.isFinite(value) ? value : 0;
  const icon = getCurrencyIcon();
  return `${safeAmount.toFixed(2)} ${icon}`;
}

module.exports = formatPrice;

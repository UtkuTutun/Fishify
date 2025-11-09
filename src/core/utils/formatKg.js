function formatKg(value) {
  const kg = Number(value);
  if (!Number.isFinite(kg) || kg < 0) {
    return '0 g';
  }

  if (kg < 1) {
    return `${Math.round(kg * 1000)} g`;
  }

  return `${kg.toFixed(2)} kg`;
}

module.exports = formatKg;

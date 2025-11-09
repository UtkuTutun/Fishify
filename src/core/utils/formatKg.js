function formatKg(kg) {
  if (kg < 1) {
    return `${Math.round(kg * 1000)} g`;
  } else {
    return `${kg.toFixed(2)} kg`;
  }
}

module.exports = formatKg;

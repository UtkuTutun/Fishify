function formatDateTR(date) {
  return date.toLocaleString('tr-TR', { hour12: false });
}

module.exports = formatDateTR;

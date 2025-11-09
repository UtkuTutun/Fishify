module.exports = {
  currency: {
    name: "Lira",
    icon: "₺"
  },
  transfer: {
  dailyTotalLimit: 1000, // Günlük toplam gönderilebilecek maksimum bakiye
  dailyLimitPerUser: 500, // Bir kullanıcıya günlük gönderilebilecek maksimum miktar
  fee: 0.02, // Transfer başına alınacak komisyon oranı (ör: %2)
  resetHour: 0, // Türkiye saatiyle sıfırlanma saati (0 = 24:00)
  enabled: true // Transfer özelliği açık mı
  }
};

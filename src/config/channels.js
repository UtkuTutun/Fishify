// Bu dosyada botun durum mesajı göndereceği kanal ID'leri tanımlanır.
// Örnek: module.exports = { statusChannelId: 'KANAL_ID' };

module.exports = {
  statusChannelId: '1437062015024627762', // Durum mesajı kanalı
  logChannelId: '1437062245854220288', // Komut loglarının gideceği kanal ID'si (ör: '123456789012345678')
  fishLogChannelId: '1437064027770454129' // !fish komutu için özel log kanalı
  ,moneyTransferLogChannelId: 'PARA_GONDERIM_LOG_KANAL_ID' // Para gönderim log kanalı
};

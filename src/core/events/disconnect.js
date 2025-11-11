const logger = require('../utils/logger');
const { sendOfflineStatus } = require('../services/bot/botStatus');

let offlineNotified = false;

async function notifyOffline(client) {
  if (offlineNotified) {
    return;
  }

  offlineNotified = true;

  try {
    await sendOfflineStatus(client);
  } catch (error) {
    await logger.error(error);
    await logger.error('Offline durumu gönderilirken hata oluştu.');
  }
}

function resetOfflineNotification() {
  offlineNotified = false;
}

const disconnectEvent = {
  name: 'shardDisconnect',
  once: false,
  async execute(closeEvent, shardId, client) {
    const reason = closeEvent?.reason || 'Sebep belirtilmedi';
    const code = closeEvent?.code ?? 'bilinmiyor';
    await logger.warn(`Shard ${shardId} bağlantısı koptu (kod: ${code}). ${reason}`);
    await notifyOffline(client);
  }
};

disconnectEvent.resetOfflineNotification = resetOfflineNotification;

module.exports = disconnectEvent;

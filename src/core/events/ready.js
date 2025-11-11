const logger = require('../utils/logger');
const { sendOnlineStatus } = require('../services/bot/botStatus');
const disconnectEvent = require('./disconnect');

const resetOfflineNotification =
  typeof disconnectEvent.resetOfflineNotification === 'function'
    ? disconnectEvent.resetOfflineNotification
    : () => {};

module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    logger.info(`Bot hazır: ${client.user.tag}`);
    resetOfflineNotification();
    sendOnlineStatus(client);
  }
};

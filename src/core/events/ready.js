const logger = require('../utils/logger');
const { sendOnlineStatus } = require('../services/botStatus');
const disconnectEvent = require('./disconnect');

const resetOfflineNotification =
  typeof disconnectEvent.resetOfflineNotification === 'function'
    ? disconnectEvent.resetOfflineNotification
    : () => {};

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    logger.info(`Bot hazır: ${client.user.tag}`);
    resetOfflineNotification();
    sendOnlineStatus(client);
  }
};

module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
  const logger = require('../utils/logger');
  logger.info(`Bot hazır: ${client.user.tag}`);
  },
};

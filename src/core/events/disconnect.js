 module.exports = {
  name: 'clientDisconnect',
  once: false,
  async execute(client) {
    const { sendOfflineStatus } = require('../status/botStatus');
    await sendOfflineStatus(client);
  },
};

const fs = require('fs');
const path = require('path');

const logger = require('../utils/logger');

function attachListener(client, event) {
  if (!event || typeof event.name !== 'string' || typeof event.execute !== 'function') {
    logger.warn('Geçersiz event dosyası yoksayıldı.');
    return;
  }

  const handler = (...args) => {
    try {
      return event.execute(...args, client);
    } catch (error) {
      logger.error(error);
      logger.error(`Event çalıştırılırken hata oluştu: ${event.name}`);
    }
  };

  if (event.once) {
    client.once(event.name, handler);
  } else {
    client.on(event.name, handler);
  }

  logger.debug(`Event yüklendi: ${event.name}`);
}

function loadEvents(client) {
  const eventsDirectory = path.join(__dirname, '../events');
  if (!fs.existsSync(eventsDirectory)) {
    logger.warn(`Event klasörü bulunamadı: ${eventsDirectory}`);
    return;
  }

  const eventFiles = fs.readdirSync(eventsDirectory).filter((file) => file.endsWith('.js'));

  eventFiles.forEach((file) => {
    const eventPath = path.join(eventsDirectory, file);
    try {
      delete require.cache[require.resolve(eventPath)];
      const event = require(eventPath);
      attachListener(client, event);
    } catch (error) {
      logger.error(error);
      logger.error(`Event dosyası yüklenemedi: ${eventPath}`);
    }
  });

  logger.info(`Toplam ${eventFiles.length} event yüklendi.`);
}

module.exports = loadEvents;

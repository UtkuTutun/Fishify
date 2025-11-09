const mongoose = require('mongoose');

const logger = require('../core/utils/logger');

mongoose.set('strictQuery', true);

const connectionOptions = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10
};

function registerConnectionLogging() {
  const connection = mongoose.connection;
  connection.on('connected', () => {
    logger.info('MongoDB bağlantısı kuruldu.');
  });
  connection.on('reconnected', () => {
    logger.warn('MongoDB bağlantısı yeniden kuruldu.');
  });
  connection.on('disconnected', () => {
    logger.warn('MongoDB bağlantısı kesildi. Yeniden bağlanmayı deneyeceğim.');
  });
  connection.on('error', (err) => {
    logger.error('MongoDB bağlantı hatası yakalandı:', err);
  });
}

let listenersRegistered = false;

async function connectDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error('MongoDB bağlantı URI\'ı belirtilmedi.');
  }

  if (!listenersRegistered) {
    registerConnectionLogging();
    listenersRegistered = true;
  }

  try {
    await mongoose.connect(mongoUri, connectionOptions);
    await logger.info('MongoDB bağlantısı başarılı.');
  } catch (error) {
    await logger.error(error);
    await logger.error('MongoDB bağlantısı başarısız.');
    throw error;
  }

  return mongoose.connection;
}

module.exports = connectDatabase;

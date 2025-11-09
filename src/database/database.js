const mongoose = require('mongoose');

module.exports = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri);
  const logger = require('../core/utils/logger');
  logger.info('MongoDB bağlantısı başarılı!');
  } catch (err) {
  logger.error('MongoDB bağlantı hatası:', err);
  }
};

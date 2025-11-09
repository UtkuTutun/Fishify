const fs = require('fs');
const path = require('path');

const logger = require('../utils/logger');

function isJavaScriptFile(entry) {
  return entry.isFile() && entry.name.endsWith('.js');
}

function isDirectory(entry) {
  return entry.isDirectory();
}

function registerCommand(client, command, commandPath) {
  if (!command || typeof command.name !== 'string' || typeof command.execute !== 'function') {
    logger.warn(`Geçersiz komut dosyası yoksayıldı: ${commandPath}`);
    return;
  }

  if (client.commands.has(command.name)) {
    logger.warn(`"${command.name}" komutu zaten kayıtlı. ${commandPath} dosyası yoksayıldı.`);
    return;
  }

  command.__path = commandPath;
  client.commands.set(command.name, command);
  logger.debug(`Komut yüklendi: ${command.name} (${commandPath})`);
}

function loadCommandFile(client, commandPath) {
  try {
    delete require.cache[require.resolve(commandPath)];
    const command = require(commandPath);
    registerCommand(client, command, commandPath);
  } catch (error) {
    logger.error(error);
    logger.error(`Komut dosyası yüklenemedi: ${commandPath}`);
  }
}

function walkCommandTree(client, directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const entryPath = path.join(directoryPath, entry.name);
    if (isDirectory(entry)) {
      walkCommandTree(client, entryPath);
      return;
    }
    if (isJavaScriptFile(entry)) {
      loadCommandFile(client, entryPath);
    }
  });
}

function loadCommands(client) {
  const commandsPath = path.join(__dirname, '../../commands');
  if (!fs.existsSync(commandsPath)) {
    logger.warn(`Komut klasörü bulunamadı: ${commandsPath}`);
    return;
  }
  walkCommandTree(client, commandsPath);
  logger.info(`Toplam ${client.commands.size} komut yüklendi.`);
}

module.exports = loadCommands;

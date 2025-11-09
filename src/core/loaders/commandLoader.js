const fs = require('fs');
const path = require('path');

function loadCommandsRecursively(dir, client) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadCommandsRecursively(fullPath, client);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      const command = require(fullPath);
      // Komutun dosya yolunu sakla
      command.__path = fullPath;
      client.commands.set(command.name, command);
    }
  });
}

module.exports = (client) => {
  const commandsPath = path.join(__dirname, '../../commands');
  if (!fs.existsSync(commandsPath)) return;
  loadCommandsRecursively(commandsPath, client);
};

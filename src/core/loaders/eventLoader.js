const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const eventsPath = path.join(__dirname, '../events');
  const absoluteEventsPath = path.join(__dirname, '../events');
  fs.readdirSync(absoluteEventsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const event = require(path.join(absoluteEventsPath, file));
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  });
};

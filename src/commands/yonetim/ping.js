module.exports = {
  name: 'ping',
  description: 'Botun pingini gösterir.',
  async execute(message) {
    await message.reply('Pong!');
  },
};

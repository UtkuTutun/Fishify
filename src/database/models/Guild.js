const mongoose = require('mongoose');


const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  allowedChannels: { type: [String], default: [] } // Channel IDs where commands are allowed
});

module.exports = mongoose.models.Guild || mongoose.model('Guild', guildSchema);
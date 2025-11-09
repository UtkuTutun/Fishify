const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  totalFishCount: { type: Number, default: 0 },
  totalFishKg: { type: Number, default: 0 }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
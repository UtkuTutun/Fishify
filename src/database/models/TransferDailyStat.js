const mongoose = require('mongoose');

const transferDailyStatSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    dayKey: { type: String, required: true },
    amount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

transferDailyStatSchema.index({ senderId: 1, receiverId: 1, dayKey: 1 }, { unique: true });

module.exports =
  mongoose.models.TransferDailyStat || mongoose.model('TransferDailyStat', transferDailyStatSchema);

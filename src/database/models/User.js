const mongoose = require('mongoose');



const transferDailyStatSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    dayKey: { type: String, required: true },
    amount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    _id: false
  }
);

transferDailyStatSchema.index({ senderId: 1, receiverId: 1, dayKey: 1 }, { unique: true, sparse: true });

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  totalFishCount: { type: Number, default: 0 },
  totalFishKg: { type: Number, default: 0 },
  // Günlük görevler için
  lastDailyTaskDate: { type: String }, // YYYY-MM-DD
  dailyTaskRewards: [
    {
      date: { type: String },
      reward: { type: Number }
    }
  ],
  // TransferDailyStat entegrasyonu
  transferDailyStats: [transferDailyStatSchema]
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
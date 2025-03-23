const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['streak', 'completion', 'category', 'challenge'],
    default: 'streak'
  },
  requirement: {
    type: Number,
    required: true
  },
  xpReward: {
    type: Number,
    default: 100
  },
  pointsReward: {
    type: Number,
    default: 50
  },
  icon: {
    type: String,
    default: 'award'
  },
  unlockedAt: {
    type: Date,
    default: null
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Achievement', AchievementSchema); 
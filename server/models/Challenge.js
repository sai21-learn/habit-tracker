const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String,
    default: ''
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  deadline: { 
    type: Date, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['health', 'spirituality', 'sleep', 'academic', 'other'],
    default: 'other'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  xpReward: {
    type: Number,
    default: 50
  },
  pointsReward: {
    type: Number,
    default: 20
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Challenge', challengeSchema); 
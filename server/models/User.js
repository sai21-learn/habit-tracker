const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    description: String,
    dateEarned: Date
  }],
  totalStreakDays: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  categoryStats: {
    health: {
      completionRate: { type: Number, default: 0 },
      streak: { type: Number, default: 0 }
    },
    spirituality: {
      completionRate: { type: Number, default: 0 },
      streak: { type: Number, default: 0 }
    },
    sleep: {
      completionRate: { type: Number, default: 0 },
      streak: { type: Number, default: 0 }
    },
    academic: {
      completionRate: { type: Number, default: 0 },
      streak: { type: Number, default: 0 }
    },
    other: {
      completionRate: { type: Number, default: 0 },
      streak: { type: Number, default: 0 }
    }
  },
  profilePicture: {
    type: String,
    default: '/images/default-avatar.png'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);

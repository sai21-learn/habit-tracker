const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Achievement = require('../models/Achievement');

// @route    POST api/users/register
// @desc     Register user
// @access   Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create default achievements for the user
    const defaultAchievements = [
      {
        userId: user._id,
        name: '10-Day Streak',
        description: 'Maintain a 10-day streak for any habit',
        type: 'streak',
        requirement: 10,
        xpReward: 100,
        pointsReward: 50,
        icon: 'flame'
      },
      {
        userId: user._id,
        name: '20-Day Milestone',
        description: 'Reach 20 days of total streak days',
        type: 'streak',
        requirement: 20,
        xpReward: 200,
        pointsReward: 100,
        icon: 'award'
      },
      {
        userId: user._id,
        name: '30-Day Master',
        description: 'Complete a 30-day habit streak',
        type: 'streak',
        requirement: 30,
        xpReward: 300,
        pointsReward: 150,
        icon: 'trophy'
      }
    ];

    await Achievement.insertMany(defaultAchievements);

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken', // Use env variable in production
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/users/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken', // Use env variable in production
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/users/profile
// @desc     Get current user profile
// @access   Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get the user's achievements
    const achievements = await Achievement.find({ userId: req.user.id });

    res.json({
      user,
      achievements
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/users/profile
// @desc     Update user profile
// @access   Private
router.put('/profile', auth, async (req, res) => {
  const { name, profilePicture } = req.body;
  const userFields = {};
  
  if (name) userFields.name = name;
  if (profilePicture) userFields.profilePicture = profilePicture;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/users/xp
// @desc     Add XP and points to user
// @access   Private
router.put('/xp', auth, async (req, res) => {
  const { xp, points } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Add XP and points
    user.xp += xp || 0;
    user.points += points || 0;

    // Calculate level based on XP (simple formula: level = xp / 100 + 1)
    const newLevel = Math.floor(user.xp / 100) + 1;
    
    // Check if level increased
    const leveledUp = newLevel > user.level;
    user.level = newLevel;

    await user.save();

    res.json({
      user,
      leveledUp
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/users/achievements
// @desc     Get user achievements
// @access   Private
router.get('/achievements', auth, async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.id });
    res.json(achievements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/users/achievements/:id/unlock
// @desc     Unlock an achievement
// @access   Private
router.put('/achievements/:id/unlock', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    });

    if (!achievement) {
      return res.status(404).json({ msg: 'Achievement not found' });
    }

    if (achievement.isUnlocked) {
      return res.status(400).json({ msg: 'Achievement already unlocked' });
    }

    // Unlock the achievement
    achievement.isUnlocked = true;
    achievement.unlockedAt = Date.now();
    await achievement.save();

    // Add XP and points to user
    let user = await User.findById(req.user.id);
    user.xp += achievement.xpReward;
    user.points += achievement.pointsReward;
    
    // Calculate level
    const newLevel = Math.floor(user.xp / 100) + 1;
    const leveledUp = newLevel > user.level;
    user.level = newLevel;

    await user.save();

    res.json({
      achievement,
      user,
      leveledUp
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 
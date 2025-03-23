const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// @route    GET api/challenges
// @desc     Get all challenges for a user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const challenges = await Challenge.find({ userId: req.user.id }).sort({ deadline: 1 });
    res.json(challenges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/challenges
// @desc     Create a challenge
// @access   Private
router.post('/', auth, async (req, res) => {
  const { name, description, category, deadline, difficulty } = req.body;

  // Calculate rewards based on difficulty
  let xpReward = 50;
  let pointsReward = 20;
  
  if (difficulty === 'medium') {
    xpReward = 100;
    pointsReward = 50;
  } else if (difficulty === 'hard') {
    xpReward = 150;
    pointsReward = 75;
  }

  try {
    const newChallenge = new Challenge({
      name,
      description,
      category: category || 'other',
      deadline,
      difficulty: difficulty || 'medium',
      xpReward,
      pointsReward,
      userId: req.user.id
    });

    const challenge = await newChallenge.save();
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/challenges/:id
// @desc     Update a challenge
// @access   Private
router.put('/:id', auth, async (req, res) => {
  const { name, description, category, deadline, difficulty } = req.body;

  // Build challenge object
  const challengeFields = {};
  if (name) challengeFields.name = name;
  if (description) challengeFields.description = description;
  if (category) challengeFields.category = category;
  if (deadline) challengeFields.deadline = deadline;
  if (difficulty) {
    challengeFields.difficulty = difficulty;
    
    // Update rewards based on difficulty
    if (difficulty === 'easy') {
      challengeFields.xpReward = 50;
      challengeFields.pointsReward = 20;
    } else if (difficulty === 'medium') {
      challengeFields.xpReward = 100;
      challengeFields.pointsReward = 50;
    } else if (difficulty === 'hard') {
      challengeFields.xpReward = 150;
      challengeFields.pointsReward = 75;
    }
  }

  try {
    let challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }

    // Make sure user owns challenge
    if (challenge.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Cannot update completed challenges
    if (challenge.isCompleted) {
      return res.status(400).json({ msg: 'Cannot update completed challenges' });
    }

    challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { $set: challengeFields },
      { new: true }
    );

    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    DELETE api/challenges/:id
// @desc     Delete a challenge
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }

    // Make sure user owns challenge
    if (challenge.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await challenge.remove();
    res.json({ msg: 'Challenge removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/challenges/:id/complete
// @desc     Complete a challenge
// @access   Private
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }

    // Make sure user owns challenge
    if (challenge.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Check if already completed
    if (challenge.isCompleted) {
      return res.status(400).json({ msg: 'Challenge already completed' });
    }

    // Check if deadline has passed
    const now = new Date();
    const deadline = new Date(challenge.deadline);
    
    if (deadline < now) {
      return res.status(400).json({ msg: 'Challenge deadline has passed' });
    }

    // Mark as completed
    challenge.isCompleted = true;
    challenge.completedAt = now;
    await challenge.save();

    // Update user XP and points
    const user = await User.findById(req.user.id);
    user.xp += challenge.xpReward;
    user.points += challenge.pointsReward;
    
    // Calculate level based on XP
    const newLevel = Math.floor(user.xp / 100) + 1;
    const leveledUp = newLevel > user.level;
    user.level = newLevel;
    
    await user.save();

    res.json({
      challenge,
      user,
      leveledUp,
      xpEarned: challenge.xpReward,
      pointsEarned: challenge.pointsReward
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/challenges/stats
// @desc     Get challenge statistics
// @access   Private
router.get('/stats', auth, async (req, res) => {
  try {
    const allChallenges = await Challenge.find({ userId: req.user.id });
    
    // Overall stats
    const totalChallenges = allChallenges.length;
    const completedChallenges = allChallenges.filter(c => c.isCompleted).length;
    const pendingChallenges = allChallenges.filter(c => !c.isCompleted && new Date(c.deadline) >= new Date()).length;
    const expiredChallenges = allChallenges.filter(c => !c.isCompleted && new Date(c.deadline) < new Date()).length;
    
    const completionRate = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
    
    // Stats by category
    const categories = ['health', 'spirituality', 'sleep', 'academic', 'other'];
    const categoryStats = {};
    
    for (const category of categories) {
      const categoryChallenges = allChallenges.filter(c => c.category === category);
      const categoryCompleted = categoryChallenges.filter(c => c.isCompleted).length;
      
      categoryStats[category] = {
        total: categoryChallenges.length,
        completed: categoryCompleted,
        rate: categoryChallenges.length > 0 ? Math.round((categoryCompleted / categoryChallenges.length) * 100) : 0
      };
    }
    
    // Stats by difficulty
    const difficulties = ['easy', 'medium', 'hard'];
    const difficultyStats = {};
    
    for (const difficulty of difficulties) {
      const difficultyArr = allChallenges.filter(c => c.difficulty === difficulty);
      const difficultyCompleted = difficultyArr.filter(c => c.isCompleted).length;
      
      difficultyStats[difficulty] = {
        total: difficultyArr.length,
        completed: difficultyCompleted,
        rate: difficultyArr.length > 0 ? Math.round((difficultyCompleted / difficultyArr.length) * 100) : 0
      };
    }
    
    // Total XP and points earned from challenges
    const xpEarned = allChallenges
      .filter(c => c.isCompleted)
      .reduce((sum, c) => sum + c.xpReward, 0);
      
    const pointsEarned = allChallenges
      .filter(c => c.isCompleted)
      .reduce((sum, c) => sum + c.pointsReward, 0);
    
    res.json({
      totalChallenges,
      completedChallenges,
      pendingChallenges,
      expiredChallenges,
      completionRate,
      categoryStats,
      difficultyStats,
      xpEarned,
      pointsEarned
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 
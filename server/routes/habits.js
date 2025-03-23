const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');
const User = require('../models/User');
const Achievement = require('../models/Achievement');

// @route    GET api/habits
// @desc     Get all habits for a user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/habits
// @desc     Create a habit
// @access   Private
router.post('/', auth, async (req, res) => {
  const { name, description, category } = req.body;

  try {
    const newHabit = new Habit({
      name,
      description,
      category: category || 'other',
      userId: req.user.id
    });

    const habit = await newHabit.save();
    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/habits/:id
// @desc     Update a habit
// @access   Private
router.put('/:id', auth, async (req, res) => {
  const { name, description, category } = req.body;

  // Build habit object
  const habitFields = {};
  if (name) habitFields.name = name;
  if (description) habitFields.description = description;
  if (category) habitFields.category = category;

  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    // Make sure user owns habit
    if (habit.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { $set: habitFields },
      { new: true }
    );

    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    DELETE api/habits/:id
// @desc     Delete a habit
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    // Make sure user owns habit
    if (habit.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await habit.remove();
    res.json({ msg: 'Habit removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/habits/:id/complete
// @desc     Complete a habit for the day
// @access   Private
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    // Make sure user owns habit
    if (habit.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
    lastCompleted && lastCompleted.setHours(0, 0, 0, 0);
    
    // Check if already completed today
    if (lastCompleted && lastCompleted.getTime() === today.getTime()) {
      return res.status(400).json({ msg: 'Habit already completed today' });
    }

    // Check if the streak should continue or reset
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = habit.streak || 0;
    
    if (lastCompleted && lastCompleted.getTime() === yesterday.getTime()) {
      // Completed yesterday, continue streak
      newStreak += 1;
    } else if (!lastCompleted || lastCompleted.getTime() < yesterday.getTime()) {
      // Missed a day or first completion, reset streak to 1
      newStreak = 1;
    }

    // Add to completion history
    const completionEntry = {
      date: today,
      streak: newStreak
    };

    habit.completionHistory.push(completionEntry);
    habit.lastCompleted = today;
    habit.streak = newStreak;
    
    await habit.save();

    // Update user stats
    const user = await User.findById(req.user.id);
    
    // Update category stats
    if (!user.categoryStats) {
      user.categoryStats = {
        health: { completionRate: 0, streak: 0 },
        spirituality: { completionRate: 0, streak: 0 },
        sleep: { completionRate: 0, streak: 0 },
        academic: { completionRate: 0, streak: 0 },
        other: { completionRate: 0, streak: 0 }
      };
    }
    
    // Calculate category completion rate
    const userHabits = await Habit.find({ userId: req.user.id, category: habit.category });
    const totalHabits = userHabits.length;
    const completedToday = userHabits.filter(h => {
      const lastComp = h.lastCompleted ? new Date(h.lastCompleted) : null;
      return lastComp && lastComp.setHours(0, 0, 0, 0) === today.getTime();
    }).length;
    
    // Update category streak and completion rate
    if (totalHabits > 0) {
      const completionRate = Math.round((completedToday / totalHabits) * 100);
      user.categoryStats[habit.category].completionRate = completionRate;
      
      if (user.categoryStats[habit.category].streak < newStreak) {
        user.categoryStats[habit.category].streak = newStreak;
      }
    }
    
    // Update total streak days
    user.totalStreakDays += 1;
    
    // Update longest streak if needed
    if (newStreak > user.longestStreak) {
      user.longestStreak = newStreak;
    }
    
    // Add XP and points for completing a habit
    user.xp += 10;
    user.points += 5;
    
    // Calculate level based on XP
    const newLevel = Math.floor(user.xp / 100) + 1;
    const leveledUp = newLevel > user.level;
    user.level = newLevel;
    
    await user.save();

    // Check for streak achievements to unlock
    let unlockedAchievements = [];
    if (newStreak === 10 || newStreak === 20 || newStreak === 30) {
      const achievement = await Achievement.findOne({
        userId: req.user.id,
        type: 'streak',
        requirement: newStreak,
        isUnlocked: false
      });
      
      if (achievement) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = Date.now();
        await achievement.save();
        
        // Add achievement rewards
        user.xp += achievement.xpReward;
        user.points += achievement.pointsReward;
        
        // Recalculate level
        const achievementNewLevel = Math.floor(user.xp / 100) + 1;
        const achievementLeveledUp = achievementNewLevel > user.level;
        user.level = achievementNewLevel;
        
        await user.save();
        
        unlockedAchievements.push(achievement);
      }
    }

    res.json({
      habit,
      user,
      leveledUp,
      unlockedAchievements
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/habits/stats
// @desc     Get habit statistics
// @access   Private
router.get('/stats', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    const user = await User.findById(req.user.id);
    
    // Get stats per category
    const categories = ['health', 'spirituality', 'sleep', 'academic', 'other'];
    const categoryStats = {};
    
    for (const category of categories) {
      const categoryHabits = habits.filter(habit => habit.category === category);
      const totalHabits = categoryHabits.length;
      
      let completedCount = 0;
      let maxStreak = 0;
      
      categoryHabits.forEach(habit => {
        if (habit.lastCompleted) {
          completedCount++;
        }
        
        if (habit.streak > maxStreak) {
          maxStreak = habit.streak;
        }
      });
      
      const completionRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
      
      categoryStats[category] = {
        totalHabits,
        completedCount,
        completionRate,
        streak: user.categoryStats ? user.categoryStats[category].streak : 0
      };
    }
    
    // Overall stats
    const totalHabits = habits.length;
    const activeHabits = habits.filter(habit => habit.streak > 0).length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.completionHistory.length, 0);
    
    res.json({
      totalHabits,
      activeHabits,
      totalCompletions,
      longestStreak: user.longestStreak || 0,
      totalStreakDays: user.totalStreakDays || 0,
      categoryStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 
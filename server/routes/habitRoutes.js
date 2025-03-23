const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// ✅ Create habit
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const habit = new Habit({ name, userId: req.userId });
  await habit.save();
  res.json(habit);
});

// ✅ Get all habits for user
router.get('/', authMiddleware, async (req, res) => {
  const habits = await Habit.find({ userId: req.userId });
  res.json(habits);
});

module.exports = router;

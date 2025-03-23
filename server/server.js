const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // ✅ import routes
const habitRoutes = require('./routes/habitRoutes');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use('/api/habits', habitRoutes);

app.use(express.json({ extended: false }));

// ✅ Use the auth routes
app.use('/api/auth', authRoutes);

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/challenges', require('./routes/challenges'));

connectDB();

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


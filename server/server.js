const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // ✅ import routes
const habitRoutes = require('./routes/habitRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use('/api/habits', habitRoutes);

app.use(express.json());

// ✅ Use the auth routes
app.use('/api/auth', authRoutes);

connectDB();

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


# Habit Tracker App

A full-stack habit tracking application built with the MERN stack (MongoDB, Express, React, Node.js). The app allows users to track habits, earn streaks, unlock achievements, and set time-bound challenges.

## Features

- **User Authentication**: Register, login, and profile management
- **Habit Tracking**: Create, update, and complete daily habits
- **Streaks & Achievements**: Earn streaks by consistently completing habits and unlock achievements
- **Challenges**: Create time-bound challenges with deadlines and difficulty levels
- **Category Management**: Organize habits and challenges into five categories
  - Health
  - Spirituality
  - Sleep
  - Academic
  - Other
- **Gamification**: Earn XP, level up, and collect points for habit completion and achievements
- **Analytics Dashboard**: View stats and track progress with visual charts
- **Profile Page**: Display user stats with circular progress indicators

## Tech Stack

- **Frontend**: React, React Router, Axios, Lucide-React icons
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS

## Getting Started

### Prerequisites

- Node.js (14.x or later)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/habit-tracker.git
   cd habit-tracker
   ```

2. Install dependencies for both server and client:
   ```
   npm run install-all
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. The application should now be running on:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
habit-tracker/
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # CSS files
│   │   └── App.js         # Main App component
├── server/                # Node.js backend
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── server.js          # Server entry point
└── package.json           # Project dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get current user profile

### Habits
- `GET /api/habits` - Get all habits for a user
- `POST /api/habits` - Create a new habit
- `PUT /api/habits/:id` - Update a habit
- `DELETE /api/habits/:id` - Delete a habit
- `PUT /api/habits/:id/complete` - Complete a habit for the day
- `GET /api/habits/stats` - Get habit statistics

### Challenges
- `GET /api/challenges` - Get all challenges for a user
- `POST /api/challenges` - Create a new challenge
- `PUT /api/challenges/:id` - Update a challenge
- `DELETE /api/challenges/:id` - Delete a challenge
- `PUT /api/challenges/:id/complete` - Complete a challenge
- `GET /api/challenges/stats` - Get challenge statistics

### Achievements
- `GET /api/users/achievements` - Get user achievements
- `PUT /api/users/achievements/:id/unlock` - Unlock an achievement

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
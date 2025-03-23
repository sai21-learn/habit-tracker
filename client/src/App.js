import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Rewards from './pages/Rewards';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', gap: '10px', padding: '10px', background: '#eee' }}>
        <Link to="/">Dashboard</Link>
        <Link to="/habits">Habits</Link>
        <Link to="/rewards">Rewards</Link>
        <Link to="/challenges">Challenges</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
        {/* ✅ Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

        {/* 🔓 Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

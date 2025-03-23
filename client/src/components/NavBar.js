import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import axios from 'axios';
import { Home, Award, Gift, Target, User, BarChart2 } from 'lucide-react';
import '../styles/NavBar.css';

const NavBar = () => {
  // Mock user data instead of fetching from API
  const [user] = useState({
    name: 'Demo User',
    xp: 125,
    level: 2
  });
  
  const location = useLocation();
  
  // No more token checks or API calls
  
  const isActive = (path) => location.pathname === path;

  // We don't need to skip rendering on login/signup pages anymore
  // if (location.pathname === '/login' || location.pathname === '/signup') {
  //   return null;
  // }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>HabitQuest</h1>
      </div>
      
      <div className="user-stats">
        <div className="xp-container">
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${user.xp % 100}%` }}></div>
          </div>
          <span className="level-indicator">Level {user.level}</span>
        </div>
      </div>
      
      <div className="nav-links">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/habits" className={isActive('/habits') ? 'active' : ''}>
          <Target size={20} />
          <span>Habits</span>
        </Link>
        <Link to="/rewards" className={isActive('/rewards') ? 'active' : ''}>
          <Gift size={20} />
          <span>Rewards</span>
        </Link>
        <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>
          <BarChart2 size={20} />
          <span>Analytics</span>
        </Link>
        <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
          <User size={20} />
          <span>Profile</span>
        </Link>
      </div>
      
      {/* Removed logout button */}
    </nav>
  );
};

export default NavBar; 
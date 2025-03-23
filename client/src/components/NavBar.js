import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import axios from 'axios';
import { Home, BarChart2, Award, User, Menu, X } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useState({
    name: 'Demo User',
    level: 3,
    xp: 230
  });
  const location = useLocation();
  
  // No more token checks or API calls
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Calculate progress to next level
  const progressToNextLevel = () => {
    const currentLevelXP = (user.level - 1) * 100;
    const nextLevelXP = user.level * 100;
    const currentXP = user.xp;
    
    const progress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(Math.max(progress, 0), 100); // Ensure between 0-100
  };

  const isActive = (path) => location.pathname === path;

  // We don't need to skip rendering on login/signup pages anymore
  // if (location.pathname === '/login' || location.pathname === '/signup') {
  //   return null;
  // }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="Logo" className="logo-image" />
          <span className="logo-text">Habit Tracker</span>
        </Link>

        <div className="user-info-container">
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <div className="level-container">
              <span className="level-text">Level {user.level}</span>
              <div className="xp-bar">
                <div 
                  className="xp-progress" 
                  style={{ width: `${progressToNextLevel()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/analytics" 
              className={`nav-link ${isActive('/analytics') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <BarChart2 size={20} />
              <span>Analytics</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/challenges" 
              className={`nav-link ${isActive('/challenges') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <Award size={20} />
              <span>Challenges</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 
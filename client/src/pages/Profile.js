import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award,
  BookOpen,
  Calendar,
  Flame,
} from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
  // Mock user data
  const [user, setUser] = useState({
    name: 'Demo User',
    level: 3,
    xp: 230,
    totalHabits: 4,
    completedHabits: 32,
    streakDays: 7,
    longestStreak: 12,
    achievements: [
      { id: 1, name: 'Early Bird', description: 'Complete a habit before 9 AM', earned: true, date: '2023-08-15' },
      { id: 2, name: 'Week Warrior', description: 'Maintain a 7-day streak', earned: true, date: '2023-08-10' },
      { id: 3, name: '10 Day Streak', description: 'Complete a habit for 10 days in a row', earned: true, date: '2023-08-05' },
      { id: 4, name: 'Habit Master', description: 'Complete all habits for 5 consecutive days', earned: false },
      { id: 5, name: 'Monthly Master', description: 'Complete a habit for 30 days in a row', earned: false },
    ]
  });

  // Fetch user data
  useEffect(() => {
    // In a real app, this would fetch from API
    // Since we're using mock data, there's nothing to do here
  }, []);

  const calculateProgress = (xp) => {
    const level = Math.floor(xp / 100) + 1;
    const levelXp = (level - 1) * 100;
    const nextLevelXp = level * 100;
    const currentLevelProgress = xp - levelXp;
    const progressPercent = (currentLevelProgress / (nextLevelXp - levelXp)) * 100;
    return progressPercent;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>{user.name.charAt(0)}</span>
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <div className="profile-level">
            <span className="level-text">Level {user.level}</span>
            <div className="xp-bar">
              <div 
                className="xp-progress" 
                style={{ width: `${calculateProgress(user.xp)}%` }}
              ></div>
            </div>
            <span className="xp-text">{user.xp} XP</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon habit-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{user.totalHabits}</span>
            <span className="stat-label">Active Habits</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{user.completedHabits}</span>
            <span className="stat-label">Habits Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon streak-icon">
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{user.streakDays}</span>
            <span className="stat-label">Current Streak</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon longest-icon">
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{user.longestStreak}</span>
            <span className="stat-label">Longest Streak</span>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-list">
          {user.achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="achievement-icon">
                <Award size={24} />
              </div>
              <div className="achievement-info">
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                {achievement.earned && (
                  <div className="achievement-earned">
                    <span>Earned on {formatDate(achievement.date)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
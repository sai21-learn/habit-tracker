import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Heart, 
  Book, 
  Moon, 
  Coffee,
  Activity
} from 'lucide-react';
import '../styles/Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalHabits: 4,
    completedToday: 2,
    totalCompletions: 32,
    streakDays: 7,
    longestStreak: 12,
    categoryStats: {
      health: { total: 12, completed: 9, rate: 75 },
      spirituality: { total: 8, completed: 4, rate: 50 },
      sleep: { total: 15, completed: 12, rate: 80 },
      academic: { total: 10, completed: 7, rate: 70 },
      other: { total: 5, completed: 0, rate: 0 }
    },
    habitProgress: [
      { name: "Morning Meditation", completions: 15, total: 20, rate: 75 },
      { name: "Reading", completions: 10, total: 20, rate: 50 },
      { name: "Evening Walk", completions: 18, total: 20, rate: 90 },
      { name: "Early Sleep", completions: 12, total: 20, rate: 60 }
    ]
  });
  
  const [activeTimeFrame, setActiveTimeFrame] = useState('week');
  
  useEffect(() => {
    // In a real app, this would fetch analytics data
    // For now, we're using mock data
  }, []);
  
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'health':
        return <Heart size={18} />;
      case 'spirituality':
        return <Coffee size={18} />;
      case 'sleep':
        return <Moon size={18} />;
      case 'academic':
        return <Book size={18} />;
      default:
        return <Activity size={18} />;
    }
  };
  
  // Mock data for distribution charts
  const weekData = [
    { day: 'Mon', blocks: [1, 3, 2, 0, 4] },
    { day: 'Tue', blocks: [2, 3, 4, 1, 0] },
    { day: 'Wed', blocks: [0, 1, 3, 4, 2] },
    { day: 'Thu', blocks: [3, 2, 1, 0, 2] },
    { day: 'Fri', blocks: [4, 3, 2, 1, 0] },
    { day: 'Sat', blocks: [1, 2, 3, 4, 5] },
    { day: 'Sun', blocks: [0, 2, 1, 3, 2] },
  ];
  
  const yearData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 75 },
    { month: 'Apr', value: 85 },
    { month: 'May', value: 60 },
    { month: 'Jun', value: 90 },
    { month: 'Jul', value: 80 },
    { month: 'Aug', value: 70 },
    { month: 'Sep', value: 50 },
    { month: 'Oct', value: 65 },
    { month: 'Nov', value: 40 },
    { month: 'Dec', value: 30 },
  ];
  
  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>Track your habit progress and view detailed statistics</p>
      </div>
      
      <div className="analytics-grid">
        <div className="analytics-main">
          <div className="chart-container">
            <div className="chart-header">
              <h2>Habit Completion Trend</h2>
              <div className="chart-controls">
                <button 
                  className={activeTimeFrame === 'week' ? 'active' : ''}
                  onClick={() => setActiveTimeFrame('week')}
                >
                  Week
                </button>
                <button 
                  className={activeTimeFrame === 'month' ? 'active' : ''}
                  onClick={() => setActiveTimeFrame('month')}
                >
                  Month
                </button>
                <button 
                  className={activeTimeFrame === 'year' ? 'active' : ''}
                  onClick={() => setActiveTimeFrame('year')}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="chart-content">
              <BarChart2 size={100} color="#d1d5db" />
              <p>Chart visualization would appear here</p>
            </div>
          </div>
          
          <div className="chart-container">
            <div className="chart-header">
              <h2>Weekly Habit Activity</h2>
            </div>
            <div className="time-distribution">
              {weekData.map((day, index) => (
                <div key={index} className="day-column">
                  <span className="day-label">{day.day}</span>
                  <div className="day-blocks">
                    {day.blocks.map((level, i) => (
                      <div 
                        key={i} 
                        className={`time-block ${level > 0 ? `level-${level}` : ''}`}
                        title={`${level} completions`}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="chart-container">
            <div className="chart-header">
              <h2>Yearly Overview</h2>
            </div>
            <div className="year-distribution">
              {yearData.map((month, index) => (
                <div key={index} className="month-column">
                  <span className="month-label">{month.month}</span>
                  <div className="month-value">
                    <div 
                      className="month-fill" 
                      style={{ height: `${month.value}%` }}
                      title={`${month.value}% completion rate`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="chart-container">
            <div className="chart-header">
              <h2>Habit Progress</h2>
            </div>
            <div className="habit-progress-list">
              {stats.habitProgress.map((habit, index) => (
                <div key={index} className="habit-progress-item">
                  <div className="habit-progress-header">
                    <span className="habit-name">{habit.name}</span>
                    <span className="habit-completion">{habit.completions}/{habit.total} ({habit.rate}%)</span>
                  </div>
                  <div className="habit-progress-bar">
                    <div 
                      className="habit-progress-fill" 
                      style={{ width: `${habit.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="analytics-sidebar">
          <div className="stats-card">
            <h3>Overview</h3>
            <div className="streak-stats">
              <div className="streak-card">
                <div className="streak-value">{stats.totalHabits}</div>
                <div className="streak-label">Active Habits</div>
              </div>
              <div className="streak-card">
                <div className="streak-value">{stats.completedToday}</div>
                <div className="streak-label">Completed Today</div>
              </div>
              <div className="streak-card">
                <div className="streak-value">{stats.streakDays}</div>
                <div className="streak-label">Current Streak</div>
              </div>
              <div className="streak-card">
                <div className="streak-value">{stats.longestStreak}</div>
                <div className="streak-label">Longest Streak</div>
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <h3>Categories</h3>
            <div className="category-stats">
              {Object.entries(stats.categoryStats).map(([category, data]) => (
                <div key={category} className="category-item">
                  <div className="category-header">
                    <div className="category-name">
                      {getCategoryIcon(category)}
                      <span>{category}</span>
                    </div>
                    <div className="category-percentage">{data.rate}%</div>
                  </div>
                  <div className="category-progress">
                    <div 
                      className={`category-progress-fill ${category}`}
                      style={{ width: `${data.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
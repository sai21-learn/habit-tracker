import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, PlusCircle, Heart, Book, Moon, Coffee, Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [habitCategory, setHabitCategory] = useState('health');
  const [habits, setHabits] = useState([
    {
      _id: '1',
      name: 'Morning Meditation',
      description: '10 minutes of mindfulness meditation',
      category: 'spirituality',
      streak: 5,
      completed: false
    },
    {
      _id: '2',
      name: 'Read a Book',
      description: 'Read for 30 minutes',
      category: 'academic',
      streak: 3,
      completed: false
    },
    {
      _id: '3',
      name: 'Evening Walk',
      description: '30 minute walk after dinner',
      category: 'health',
      streak: 7,
      completed: false
    },
    {
      _id: '4',
      name: 'Early Sleep',
      description: 'Go to bed before 10pm',
      category: 'sleep',
      streak: 2,
      completed: false
    }
  ]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [userStats, setUserStats] = useState({
    level: 3,
    xp: 230,
    nextLevelXp: 300,
    streakDays: 7,
    longestStreak: 12,
    completionRate: 75
  });
  const [loading, setLoading] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    // In a real app, we would fetch habits from an API
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new habit
    const newHabit = {
      _id: Date.now().toString(),
      name: habitName,
      description: habitDescription,
      category: habitCategory,
      streak: 0,
      completed: false
    };
    
    // Add to habits list
    setHabits([...habits, newHabit]);
    
    // Update stats
    setUserStats({
      ...userStats,
      xp: userStats.xp + 5
    });
    
    // Reset form
    setHabitName('');
    setHabitDescription('');
    setHabitCategory('health');
    
    toast.success('Habit added successfully!');
  };

  const completeHabit = (id) => {
    const updatedHabits = habits.map(habit => {
      if (habit._id === id) {
        const updatedHabit = { 
          ...habit, 
          completed: !habit.completed,
          streak: !habit.completed ? habit.streak + 1 : habit.streak
        };
        
        // Check for streak achievements
        if (updatedHabit.streak === 7 && !habit.completed) {
          setAchievement({
            name: 'Week Warrior',
            description: 'Complete a habit for 7 days in a row'
          });
          setShowAchievement(true);
          setTimeout(() => setShowAchievement(false), 5000);
        }
        
        return updatedHabit;
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    
    // Update user stats
    const habit = habits.find(h => h._id === id);
    if (!habit.completed) {
      const newXp = userStats.xp + 10;
      const newLevel = Math.floor(newXp / 100) + 1;
      const levelUp = newLevel > userStats.level;
      
      setUserStats({
        ...userStats,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newLevel * 100,
        streakDays: userStats.streakDays + 1,
        longestStreak: Math.max(userStats.longestStreak, userStats.streakDays + 1)
      });
      
      if (levelUp) {
        toast.success(`Level Up! You're now level ${newLevel}!`);
      }
    }
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit._id !== id));
    toast.info('Habit deleted');
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'health':
        return <Heart size={16} />;
      case 'spirituality':
        return <Coffee size={16} />;
      case 'sleep':
        return <Moon size={16} />;
      case 'academic':
        return <Book size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  const filteredHabits = activeFilter === 'all' 
    ? habits 
    : habits.filter(habit => habit.category === activeFilter);

  if (loading) return <div className="dashboard-container"><p>Loading habits...</p></div>;

  const completionRate = Math.round((habits.filter(h => h.completed).length / habits.length) * 100) || 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Habits Dashboard</h1>
        
        <div className="user-stats-row">
          <div className="user-stats-card">
            <div className="user-stats-header">
              <h3>Level Progress</h3>
              <span className="xp-text">{userStats.xp} XP</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(userStats.xp % 100) * 100 / 100}%` }}
              ></div>
            </div>
            <div className="progress-text">
              Level {userStats.level} • {100 - (userStats.xp % 100)} XP to next level
            </div>
          </div>
          
          <div className="user-stats-card">
            <div className="user-stats-header">
              <h3>Today's Progress</h3>
              <span className="completion-rate">{completionRate}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {habits.filter(h => h.completed).length}/{habits.length} habits completed
            </div>
          </div>
          
          <div className="user-stats-card">
            <div className="user-stats-header">
              <h3>Streak Stats</h3>
            </div>
            <div className="streak-stats">
              <div className="streak-stat">
                <span className="streak-label">Current Streak</span>
                <span className="streak-value">{userStats.streakDays} days</span>
              </div>
              <div className="streak-stat">
                <span className="streak-label">Longest Streak</span>
                <span className="streak-value">{userStats.longestStreak} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="habits-form-container">
        <h2>Add New Habit</h2>
        <form className="habits-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="Habit name"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              placeholder="Description (optional)"
            />
          </div>
          
          <div className="form-group">
            <select
              value={habitCategory}
              onChange={(e) => setHabitCategory(e.target.value)}
            >
              <option value="health">Health</option>
              <option value="spirituality">Spirituality</option>
              <option value="sleep">Sleep</option>
              <option value="academic">Academic</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <button type="submit" className="add-habit-btn">
            <PlusCircle size={16} />
            Add Habit
          </button>
        </form>
      </div>
      
      <div className="habits-container">
        <h2>My Habits</h2>
        
        <div className="category-filters">
          <button 
            className={`category-filter ${activeFilter === 'all' ? 'active' : ''}`}
            data-category="all"
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`category-filter ${activeFilter === 'health' ? 'active' : ''}`}
            data-category="health"
            onClick={() => setActiveFilter('health')}
          >
            Health
          </button>
          <button 
            className={`category-filter ${activeFilter === 'spirituality' ? 'active' : ''}`}
            data-category="spirituality"
            onClick={() => setActiveFilter('spirituality')}
          >
            Spirituality
          </button>
          <button 
            className={`category-filter ${activeFilter === 'sleep' ? 'active' : ''}`}
            data-category="sleep"
            onClick={() => setActiveFilter('sleep')}
          >
            Sleep
          </button>
          <button 
            className={`category-filter ${activeFilter === 'academic' ? 'active' : ''}`}
            data-category="academic"
            onClick={() => setActiveFilter('academic')}
          >
            Academic
          </button>
          <button 
            className={`category-filter ${activeFilter === 'other' ? 'active' : ''}`}
            data-category="other"
            onClick={() => setActiveFilter('other')}
          >
            Other
          </button>
        </div>
        
        <div className="habit-cards">
          {filteredHabits.length === 0 ? (
            <div className="empty-state">
              <Activity size={48} />
              <h3>No habits found</h3>
              <p>Add a new habit to get started!</p>
            </div>
          ) : (
            filteredHabits.map(habit => (
              <div 
                key={habit._id} 
                className={`habit-card ${habit.completed ? 'completed' : ''}`}
              >
                <div className="habit-card-header">
                  <div 
                    className="habit-category" 
                    data-category={habit.category}
                  >
                    {getCategoryIcon(habit.category)}
                    <span>{habit.category}</span>
                  </div>
                  <div className="habit-actions">
                    <button 
                      className="delete-btn"
                      onClick={() => deleteHabit(habit._id)}
                    >
                      <Circle size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="habit-name">{habit.name}</h3>
                {habit.description && (
                  <p className="habit-description">{habit.description}</p>
                )}
                
                <div className="habit-stats">
                  <div className="streak-count">
                    <span className="active">•</span>
                    <span>{habit.streak} day streak</span>
                  </div>
                </div>
                
                <button 
                  className={`complete-btn ${habit.completed ? 'completed' : ''}`}
                  onClick={() => completeHabit(habit._id)}
                >
                  {habit.completed ? (
                    <>
                      <CheckCircle size={16} />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle size={16} />
                      <span>Complete</span>
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {showAchievement && achievement && (
        <div className="achievement-notification">
          <div className="achievement-content">
            <h3>{achievement.name}</h3>
            <p>{achievement.description}</p>
          </div>
          <button 
            className="close-btn"
            onClick={() => setShowAchievement(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

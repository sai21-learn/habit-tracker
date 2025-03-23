import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  ArrowRight,
  Dumbbell,
  Book,
  Moon,
  Heart,
  Coffee,
  AlertTriangle
} from 'lucide-react';
import '../styles/Challenges.css';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    expired: 0,
    categoryCompletion: {
      health: 0,
      spirituality: 0,
      sleep: 0,
      academic: 0,
      other: 0
    },
    difficultyCompletion: {
      easy: 0,
      medium: 0,
      hard: 0
    },
    totalXpEarned: 0,
    totalPointsEarned: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'health',
    deadline: '',
    difficulty: 'medium'
  });
  
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Load mock challenges
    const mockChallenges = [
      {
        _id: '1',
        name: 'Run 5k',
        description: 'Complete a 5k run before the deadline',
        category: 'health',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        difficulty: 'medium',
        completed: false,
        rewards: { xp: 50, points: 100 }
      },
      {
        _id: '2',
        name: 'Read a Book',
        description: 'Finish reading a book by the deadline',
        category: 'academic',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        difficulty: 'easy',
        completed: false,
        rewards: { xp: 30, points: 50 }
      },
      {
        _id: '3',
        name: 'Meditate Daily',
        description: 'Meditate for 10 minutes every day until the deadline',
        category: 'spirituality',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        difficulty: 'hard',
        completed: false,
        rewards: { xp: 100, points: 200 }
      },
      {
        _id: '4',
        name: 'Early Sleep',
        description: 'Sleep before 10pm every day for a week',
        category: 'sleep',
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        difficulty: 'medium',
        completed: false,
        rewards: { xp: 50, points: 100 }
      },
      {
        _id: '5',
        name: 'No Social Media',
        description: 'Avoid social media for 3 days',
        category: 'other',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        difficulty: 'medium',
        completed: false,
        rewards: { xp: 50, points: 100 }
      },
      {
        _id: '6',
        name: 'Learn a New Skill',
        description: 'Complete an online course or tutorial',
        category: 'academic',
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        difficulty: 'hard',
        completed: true,
        rewards: { xp: 100, points: 200 }
      }
    ];
    
    setChallenges(mockChallenges);
    
    // Calculate stats
    const total = mockChallenges.length;
    const completed = mockChallenges.filter(c => c.completed).length;
    const expired = mockChallenges.filter(c => new Date(c.deadline) < new Date() && !c.completed).length;
    const pending = total - completed - expired;
    
    const categoryCompletion = {
      health: 0,
      spirituality: 0,
      sleep: 0,
      academic: 0,
      other: 0
    };
    
    const difficultyCompletion = {
      easy: 0,
      medium: 0,
      hard: 0
    };
    
    let totalXpEarned = 0;
    let totalPointsEarned = 0;
    
    mockChallenges.forEach(challenge => {
      if (challenge.completed) {
        categoryCompletion[challenge.category]++;
        difficultyCompletion[challenge.difficulty]++;
        totalXpEarned += challenge.rewards.xp;
        totalPointsEarned += challenge.rewards.points;
      }
    });
    
    setStats({
      total,
      completed,
      pending,
      expired,
      categoryCompletion,
      difficultyCompletion,
      totalXpEarned,
      totalPointsEarned
    });
    
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new challenge
    const newChallenge = {
      _id: Date.now().toString(),
      ...formData,
      deadline: new Date(formData.deadline),
      completed: false,
      rewards: calculateRewards(formData.difficulty)
    };
    
    // Add to challenges list
    setChallenges([...challenges, newChallenge]);
    
    // Update stats
    setStats({
      ...stats,
      total: stats.total + 1,
      pending: stats.pending + 1
    });
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: 'health',
      deadline: '',
      difficulty: 'medium'
    });
  };
  
  const calculateRewards = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { xp: 30, points: 50 };
      case 'medium':
        return { xp: 50, points: 100 };
      case 'hard':
        return { xp: 100, points: 200 };
      default:
        return { xp: 50, points: 100 };
    }
  };
  
  const completeChallenge = (id) => {
    const updatedChallenges = challenges.map(challenge => {
      if (challenge._id === id) {
        return { ...challenge, completed: true };
      }
      return challenge;
    });
    
    setChallenges(updatedChallenges);
    
    // Update stats
    const challenge = challenges.find(c => c._id === id);
    setStats({
      ...stats,
      completed: stats.completed + 1,
      pending: stats.pending - 1,
      categoryCompletion: {
        ...stats.categoryCompletion,
        [challenge.category]: stats.categoryCompletion[challenge.category] + 1
      },
      difficultyCompletion: {
        ...stats.difficultyCompletion,
        [challenge.difficulty]: stats.difficultyCompletion[challenge.difficulty] + 1
      },
      totalXpEarned: stats.totalXpEarned + challenge.rewards.xp,
      totalPointsEarned: stats.totalPointsEarned + challenge.rewards.points
    });
  };
  
  const deleteChallenge = (id) => {
    const challenge = challenges.find(c => c._id === id);
    const isCompleted = challenge.completed;
    const isExpired = new Date(challenge.deadline) < new Date() && !challenge.completed;
    
    // Remove challenge
    const updatedChallenges = challenges.filter(challenge => challenge._id !== id);
    setChallenges(updatedChallenges);
    
    // Update stats
    const newStats = { ...stats, total: stats.total - 1 };
    
    if (isCompleted) {
      newStats.completed = stats.completed - 1;
      newStats.categoryCompletion = {
        ...stats.categoryCompletion,
        [challenge.category]: stats.categoryCompletion[challenge.category] - 1
      };
      newStats.difficultyCompletion = {
        ...stats.difficultyCompletion,
        [challenge.difficulty]: stats.difficultyCompletion[challenge.difficulty] - 1
      };
      newStats.totalXpEarned = stats.totalXpEarned - challenge.rewards.xp;
      newStats.totalPointsEarned = stats.totalPointsEarned - challenge.rewards.points;
    } else if (isExpired) {
      newStats.expired = stats.expired - 1;
    } else {
      newStats.pending = stats.pending - 1;
    }
    
    setStats(newStats);
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'health':
        return <Heart size={16} />;
      case 'spirituality':
        return <Coffee size={16} />;
      case 'sleep':
        return <Moon size={16} />;
      case 'academic':
        return <Book size={16} />;
      default:
        return <Dumbbell size={16} />;
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const filteredChallenges = challenges.filter(challenge => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return challenge.completed;
    if (activeFilter === 'pending') return !challenge.completed && new Date(challenge.deadline) >= new Date();
    if (activeFilter === 'expired') return !challenge.completed && new Date(challenge.deadline) < new Date();
    return true;
  });

  return (
    <div className="challenges-container">
      <h1 className="section-title">Challenges</h1>
      
      <div className="challenges-grid">
        <div className="challenges-main">
          <div className="challenges-form-container">
            <h2>Create New Challenge</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Challenge Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter challenge name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your challenge"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="health">Health</option>
                    <option value="spirituality">Spirituality</option>
                    <option value="sleep">Sleep</option>
                    <option value="academic">Academic</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="deadline">Deadline</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <button type="submit" className="submit-btn">
                <Plus size={16} />
                Create Challenge
              </button>
            </form>
          </div>
          
          <div className="challenges-list-container">
            <div className="challenges-header">
              <h2>Your Challenges</h2>
              <div className="challenges-filters">
                <button 
                  className={activeFilter === 'all' ? 'active' : ''}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({challenges.length})
                </button>
                <button 
                  className={activeFilter === 'pending' ? 'active' : ''}
                  onClick={() => setActiveFilter('pending')}
                >
                  Pending ({stats.pending})
                </button>
                <button 
                  className={activeFilter === 'completed' ? 'active' : ''}
                  onClick={() => setActiveFilter('completed')}
                >
                  Completed ({stats.completed})
                </button>
                <button 
                  className={activeFilter === 'expired' ? 'active' : ''}
                  onClick={() => setActiveFilter('expired')}
                >
                  Expired ({stats.expired})
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Loading challenges...</div>
            ) : filteredChallenges.length === 0 ? (
              <div className="empty-state">
                <AlertTriangle size={48} />
                <h3>No challenges found</h3>
                <p>Create a new challenge to get started!</p>
              </div>
            ) : (
              <div className="challenges-list">
                {filteredChallenges.map(challenge => {
                  const daysRemaining = getDaysRemaining(challenge.deadline);
                  const isExpired = daysRemaining < 0;
                  
                  return (
                    <div 
                      key={challenge._id} 
                      className={`challenge-card ${challenge.completed ? 'completed' : ''} ${isExpired && !challenge.completed ? 'expired' : ''}`}
                    >
                      <div className="challenge-header">
                        <div className={`challenge-category ${challenge.category}`}>
                          {getCategoryIcon(challenge.category)}
                          <span>{challenge.category}</span>
                        </div>
                        <div className={`challenge-difficulty ${challenge.difficulty}`}>
                          {challenge.difficulty}
                        </div>
                      </div>
                      
                      <h3 className="challenge-name">{challenge.name}</h3>
                      <p className="challenge-description">{challenge.description}</p>
                      
                      <div className="challenge-deadline">
                        <Calendar size={16} />
                        <span>Deadline: {formatDate(challenge.deadline)}</span>
                      </div>
                      
                      <div className="challenge-status">
                        {challenge.completed ? (
                          <div className="status completed">
                            <CheckCircle size={16} />
                            <span>Completed</span>
                          </div>
                        ) : isExpired ? (
                          <div className="status expired">
                            <XCircle size={16} />
                            <span>Expired</span>
                          </div>
                        ) : (
                          <div className="status pending">
                            <Clock size={16} />
                            <span>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="challenge-rewards">
                        <div className="reward">
                          <Trophy size={16} />
                          <span>{challenge.rewards.xp} XP</span>
                        </div>
                        <div className="reward">
                          <Trophy size={16} />
                          <span>{challenge.rewards.points} Points</span>
                        </div>
                      </div>
                      
                      <div className="challenge-actions">
                        {!challenge.completed && !isExpired && (
                          <button 
                            className="complete-btn"
                            onClick={() => completeChallenge(challenge._id)}
                          >
                            <CheckCircle size={16} />
                            <span>Complete</span>
                          </button>
                        )}
                        <button 
                          className="delete-btn"
                          onClick={() => deleteChallenge(challenge._id)}
                        >
                          <XCircle size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <div className="challenges-sidebar">
          <div className="stats-card">
            <h3>Challenge Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{stats.completed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pending</span>
                <span className="stat-value">{stats.pending}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Expired</span>
                <span className="stat-value">{stats.expired}</span>
              </div>
            </div>
            
            <div className="completion-rate">
              <h4>Completion Rate</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <span>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
            </div>
            
            <div className="rewards-earned">
              <h4>Rewards Earned</h4>
              <div className="rewards-grid">
                <div className="reward-item">
                  <Trophy size={20} />
                  <span className="reward-value">{stats.totalXpEarned}</span>
                  <span className="reward-label">XP</span>
                </div>
                <div className="reward-item">
                  <Trophy size={20} />
                  <span className="reward-value">{stats.totalPointsEarned}</span>
                  <span className="reward-label">Points</span>
                </div>
              </div>
            </div>
            
            <div className="categories">
              <h4>Categories</h4>
              <div className="category-stats">
                {Object.entries(stats.categoryCompletion).map(([category, count]) => (
                  <div key={category} className="category-item">
                    <div className="category-name">
                      {getCategoryIcon(category)}
                      <span>{category}</span>
                    </div>
                    <span className="category-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Circle } from 'lucide-react';



export default function Dashboard() {
  const [habitName, setHabitName] = useState('');
  const [habits, setHabits] = useState([]);
  const [message, setMessage] = useState('');
  const [completedHabits, setCompletedHabits] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('User not authenticated.');
      return;
    }
    axios
      .get('http://localhost:5000/api/habits', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setHabits(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setMessage('Error loading habits.');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/habits',
        { name: habitName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Habit added!');
      setHabits([...habits, res.data]);
      setHabitName('');
    } catch (err) {
      setMessage('Error adding habit');
    }
  };

  const toggleCompletion = (id) => {
    setCompletedHabits((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completionRate = () => {
    const total = habits.length;
    const completed = Object.values(completedHabits).filter(Boolean).length;
    return total ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading habits...</p>;

  return (
    <div className="container">
      <h2>Welcome, Track Your Habits</h2>
  
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Enter a new habit"
          required
        />
        <button type="submit">+ Add Habit</button>
      </form>
  
      <p>{message}</p>
  
      <h3>Your Habits:</h3>
      <ul className="habit-list">
        {habits.map((habit) => (
          <li key={habit._id} className="habit-card">{habit.name}</li>
        ))}
      </ul>
  

      <p>{message}</p>

      <div className="progress-bar">
  <div className="progress-fill" style={{ width: `${completionRate()}%` }}></div>
</div>

      <p>{completionRate()}% completed today</p>

      <div className="habit-cards">
        {habits.map((habit) => (
          <div
            key={habit._id}
            className="habit-card"
            onClick={() => toggleCompletion(habit._id)}
            style={{
              background: completedHabits[habit._id] ? '#004d40' : '#111',
              color: '#fff',
            }}
          >
            {completedHabits[habit._id] ? (
              <CheckCircle color="#00E676" />
            ) : (
              <Circle color="#757575" />
            )}
            <span style={{ marginLeft: '10px' }}>{habit.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

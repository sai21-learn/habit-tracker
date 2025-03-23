import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [habitName, setHabitName] = useState('');
  const [habits, setHabits] = useState([]);
  const [message, setMessage] = useState('');

  // ✅ Fetch habits on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token is", token); // ✅ TEMP DEBUG LINE

    axios
      .get('http://localhost:5000/api/habits', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setHabits(res.data))
      .catch((err) => console.log(err));
  }, []);
  if (!token) {
    console.log("User not authenticated.");
    return;
  }
  
  // ✅ Handle adding new habit
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

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to the Dashboard</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Enter a new habit"
          required
        />
        <button type="submit">Add Habit</button>
      </form>

      <p>{message}</p>

      <h3>Your Habits:</h3>
      <ul>
        {habits.map((habit) => (
          <li key={habit._id}>{habit.name}</li>
        ))}
      </ul>
    </div>
  );
}

// components/TodaysLeaderboard.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchUsers} from '../store/allUsersStore'
// import './TodaysLeaderboard.css'; // Import the CSS file for styling

function TodaysLeaderboard() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.allUsers);



  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  console.log("users", users)

  // Dummy data for the leaderboard
  const leaderboardData = [
    { userName: 'Alice', rank: 1, points: 150 },
    { userName: 'Bob', rank: 2, points: 120 },
    { userName: 'Charlie', rank: 3, points: 100 },
    { userName: 'Diana', rank: 4, points: 80 },
    { userName: 'Ethan', rank: 5, points: 60 },
  ];

  return (
    <div className="leaderboard-container">
      <h2>Today's Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Rank</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry) => (
            <tr key={entry.rank}>
              <td>{entry.userName}</td>
              <td>{entry.rank}</td>
              <td>{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodaysLeaderboard;

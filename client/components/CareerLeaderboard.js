// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUsers } from '../store/allUsersStore';

// function CareerLeaderboard() {
//   const dispatch = useDispatch();
//   const users = useSelector((state) => state.allUsers || []);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Sort users by totalPoints
//   const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

//   // Assign ranks
//   let rank = 1;
//   let prevPoints = null;

//   sortedUsers.forEach((user, index) => {
//     if (user.totalPoints !== prevPoints) {
//       rank = index + 1;
//     }
//     user.rank = rank; // Store rank in user object
//     prevPoints = user.totalPoints;
//   });

//   return (
//     <div className="leaderboard-container">
//       <h2 className="leaderboard-heading">Career Leaderboard</h2>
//       <table className="leaderboard-table">
//         <thead>
//           <tr>
//             <th>User</th>
//             <th>Rank</th>
//             <th>Wins</th>
//             <th>Points</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedUsers.map((user) => (
//             <tr key={user.id}>
//               <td>
//                 <div className="user-info">
//                   <img src={user.image} alt={user.username} className="user-img" />
//                   <span className="username">{user.username}</span>
//                 </div>
//               </td>
//               <td style={{ textAlign: 'center' }}>
//                 {user.rank === 1 && <span className="medal gold">🥇</span>}
//                 {user.rank === 2 && <span className="medal silver">🥈</span>}
//                 {user.rank === 3 && <span className="medal bronze">🥉</span>}
//                 {user.rank}
//               </td>
//               <td style={{ textAlign: 'center' }}>{user.wins}</td>
//               <td style={{ textAlign: 'center' }}>{user.totalPoints}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default CareerLeaderboard;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/allUsersStore';
import { fetchGuesses } from '../store/allGuessesStore';
import { fetchQuestions } from '../store/allQuestionsStore';

function CareerLeaderboard() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.allUsers || []);
  const guesses = useSelector((state) => state.allGuesses || []);
  const questions = useSelector((state) => state.allQuestions || []);

  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchGuesses());
    dispatch(fetchQuestions());
  }, [dispatch]);

  // Build a map of questions by id for easy lookup
  const questionMap = {};
  questions.forEach((question) => {
    questionMap[question.id] = question;
  });

  // Build userStats: { [userId]: { [category]: { points, wins } } }
  const userStats = {};

  // Process guesses to accumulate points per user per category
  guesses.forEach((guess) => {
    const { userId, questionId, pointsEarned } = guess;
    const question = questionMap[questionId];
    if (question) {
      const category = question.category || 'Other';
      if (!userStats[userId]) {
        userStats[userId] = {};
      }
      if (!userStats[userId][category]) {
        userStats[userId][category] = { points: 0, wins: 0 };
      }
      userStats[userId][category].points += pointsEarned || 0;
    }
  });

  // Process questions to accumulate wins per user per category
  questions.forEach((question) => {
    const { dailyWinnerId, category } = question;
    const categoryName = category || 'Other';
    if (dailyWinnerId) {
      if (!userStats[dailyWinnerId]) {
        userStats[dailyWinnerId] = {};
      }
      if (!userStats[dailyWinnerId][categoryName]) {
        userStats[dailyWinnerId][categoryName] = { points: 0, wins: 0 };
      }
      userStats[dailyWinnerId][categoryName].wins += 1;
    }
  });

  // Build usersWithStats array
  const usersWithStats = users.map((user) => {
    const userId = user.id;
    const statsByCategory = userStats[userId] || {};
    let totalPoints = 0;
    let totalWins = 0;
    if (selectedCategory === 'All') {
      Object.values(statsByCategory).forEach((stats) => {
        totalPoints += stats.points;
        totalWins += stats.wins;
      });
    } else {
      const stats = statsByCategory[selectedCategory] || { points: 0, wins: 0 };
      totalPoints = stats.points;
      totalWins = stats.wins;
    }
    return {
      ...user,
      totalPoints,
      wins: totalWins,
    };
  });

  // Sort users by totalPoints
  const sortedUsers = usersWithStats.sort((a, b) => b.totalPoints - a.totalPoints);

  // Assign ranks
  let rank = 1;
  let prevPoints = null;

  sortedUsers.forEach((user, index) => {
    if (user.totalPoints !== prevPoints) {
      rank = index + 1;
    }
    user.rank = rank; // Store rank in user object
    prevPoints = user.totalPoints;
  });

  // Category options
  const categories = ['All', 'Sports', 'Food', 'Places', 'Entertainment', 'Other'];

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-heading">Career Leaderboard</h2>
      {/* Category Dropdown */}
      <div className="category-selector">
        <label htmlFor="category-select">Select Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Rank</th>
            <th>Wins</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-info">
                  <img src={user.image} alt={user.username} className="user-img" />
                  <span className="username">{user.username}</span>
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                {user.rank === 1 && <span className="medal gold">🥇</span>}
                {user.rank === 2 && <span className="medal silver">🥈</span>}
                {user.rank === 3 && <span className="medal bronze">🥉</span>}
                {user.rank}
              </td>
              <td style={{ textAlign: 'center' }}>{user.wins}</td>
              <td style={{ textAlign: 'center' }}>{user.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CareerLeaderboard;

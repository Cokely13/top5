// // components/TodaysLeaderboard.js

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {fetchUsers} from '../store/allUsersStore'
// // import './TodaysLeaderboard.css'; // Import the CSS file for styling

// function CareerLeaderboard() {
//   const dispatch = useDispatch();
//   const users = useSelector((state) => state.allUsers);


//   const sortedUsers = users.sort((a, b) => b.totalPoints - a.totalPoints);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   let rank = 1;
// let prevPoints = null;

// sortedUsers.forEach((user, index) => {
//   if (user.totalPoints !== prevPoints) {
//     rank = index + 1;
//   }
//   user.rank = rank; // Store rank in user object
//   prevPoints = user.totalPoints;
// });


//   return (
//     <div className="leaderboard-container">
//       <h2>Career Leaderboard</h2>
//       <table className="leaderboard-table">
//         <thead>
//           <tr>
//             <th>User Name</th>
//             <th>Rank</th>
//             <th>Points</th>
//           </tr>
//         </thead>
//         <tbody>
//         {sortedUsers.map((user) => (
//   <tr key={user.id}>
//     <td>{user.username}</td>
//     <td>{user.rank}</td>
//     <td>{user.totalPoints}</td>
//   </tr>
// ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default CareerLeaderboard;


// components/CareerLeaderboard.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/allUsersStore';

function CareerLeaderboard() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.allUsers || []);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Sort users by totalPoints
  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

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

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-heading">Career Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Rank</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.rank}</td>
              <td>{user.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CareerLeaderboard;

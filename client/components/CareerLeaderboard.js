
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
//             <th>Points</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedUsers.map((user) => (
//             <tr key={user.id}>
//              <td>
//   <div className="user-info">
//     <img src={user.image} alt={user.username} className="user-img" />
//     <span className="username">{user.username}</span>
//   </div>
// </td>
//               <td style={{ textAlign: 'center' }}>{user.rank}</td>
//               <td style={{ textAlign: 'center' }}>{user.totalPoints}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default CareerLeaderboard;

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
            <th>User</th>
            <th>Rank</th>
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
              <td style={{ textAlign: 'center' }}>{user.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CareerLeaderboard;

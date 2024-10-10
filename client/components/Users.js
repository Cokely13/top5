// import { useDispatch, useSelector } from 'react-redux';
// import React, { useEffect } from 'react';
// import { fetchUsers } from '../store/allUsersStore';
// import { Link } from 'react-router-dom';

// function UserPage() {
//   const dispatch = useDispatch();
//   const users = useSelector((state) => state.allUsers);
//   const { id: currentUserId } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const filteredUsers = users.filter((user) => user.id !== currentUserId);

//   return (
//     <div className="page-container">
//       <h1 className="page-heading">
//         <u>
//           <b>Users</b>
//         </u>
//       </h1>
//       <div className="card-container">
//         {filteredUsers.map((user) => (
//           <div key={user.id} className="card">
//             <Link to={`/users/${user.id}`} className="card-link">
//               {/* Display User Image */}
//               {user.image && (
//                 <img
//                   src={user.image}
//                   alt={user.username}
//                   className="user-image-thumbnail"
//                 />
//               )}
//               {/* Display User Name */}
//               <h2 className="card-heading">{user.username}</h2>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default UserPage;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/allUsersStore';
import { Link } from 'react-router-dom';

function UserPage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.allUsers);
  const { id: currentUserId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter((user) => user.id !== currentUserId);

  return (
    <div className="user-page-container">
      <h1 className="user-page-heading">
        <u>
          <b>Users</b>
        </u>
      </h1>
      <div className="user-page-card-container">
        {filteredUsers.map((user) => (
          <div key={user.id} className="user-page-card">
            <Link to={`/users/${user.id}`} className="user-page-card-link">
              <div className="user-page-card-image-container">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="user-page-card-image"
                  />
                ) : (
                  <div className="user-page-card-placeholder">
                    <i className="fas fa-user-circle"></i>
                  </div>
                )}
              </div>
              <h2 className="user-page-card-username">{user.username}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserPage;

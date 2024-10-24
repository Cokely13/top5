// // DailyCongrats.js
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestions } from '../store/allQuestionsStore';
// import { fetchUsers } from '../store/allUsersStore';
// import Modal from './Modal'; // Assuming you have a Modal component
// import { fetchSingleUser } from '../store/singleUserStore';

// function DailyCongrats() {
//   const dispatch = useDispatch();
//   const questions = useSelector((state) => state.allQuestions || []);
//   const users = useSelector((state) => state.allUsers || []);
//   const { id: userId, username } = useSelector((state) => state.auth);

//   const [userRank, setUserRank] = useState(null);
//   const [showCongratsModal, setShowCongratsModal] = useState(false);

//   useEffect(() => {
//     dispatch(fetchQuestions());
//     dispatch(fetchUsers());
//     if (userId) {
//       dispatch(fetchSingleUser(userId));
//     }
//   }, [dispatch, userId]);


//   useEffect(() => {
//     if (questions.length > 0 && users.length > 0) {
//       // Get yesterday's date in YYYY-MM-DD format
//       const yesterday = new Date();
//       yesterday.setDate(yesterday.getDate() - 1);
//       const yesterdayDate = yesterday.toISOString().split('T')[0];


//       // Find the question corresponding to yesterday's date
//       const yesterdayQuestion = questions.find(
//         (q) => q.dateAsked == yesterdayDate
//       );

//       if (yesterdayQuestion && yesterdayQuestion.Guesses) {
//         // Create a map of userId to username and image for quick lookup
//         const usersMap = {};
//         users.forEach((user) => {
//           usersMap[user.id] = { username: user.username, image: user.image };
//         });

//         const userPointsMap = {};

//         yesterdayQuestion.Guesses.forEach((guess) => {
//           const userId = guess.userId;
//           const user = usersMap[userId] || {
//             username: 'Unknown User',
//             image: '',
//           };
//           const pointsEarned = guess.pointsEarned || 0;

//           if (!userPointsMap[userId]) {
//             userPointsMap[userId] = {
//               userId,
//               username: user.username,
//               image: user.image,
//               points: 0,
//             };
//           }

//           userPointsMap[userId].points += pointsEarned;
//         });

//         // Convert to array and sort by points
//         let leaderboard = Object.values(userPointsMap);
//         leaderboard.sort((a, b) => b.points - a.points);



//         // Handle ranking with ties
//         let rank = 1;
//         let prevPoints = null;

//         leaderboard.forEach((user, index) => {
//           if (user.points !== prevPoints) {
//             rank = index + 1;
//           }
//           user.rank = rank;
//           prevPoints = user.points;
//         });

//         // Find the current user's rank
//         const currentUserEntry = leaderboard.find(
//           (entry) => entry.userId === userId
//         );

//         if (currentUserEntry && currentUserEntry.rank <= 3) {
//           setUserRank(currentUserEntry.rank);
//           setShowCongratsModal(true);
//         }
//       }
//     }
//   }, [questions, users, userId]);

//   const closeModal = () => {
//     setShowCongratsModal(false);
//   };

//   const getOrdinal = (n) => {
//     const s = ['th', 'st', 'nd', 'rd'],
//       v = n % 100;
//     return n + (s[(v - 20) % 10] || s[v] || s[0]);
//   };

//   if (!showCongratsModal) {
//     return null;
//   }

//   return (
//     <Modal onClose={closeModal}>
//       <h2>Congratulations, {username}!</h2>
//       <p>You got {getOrdinal(userRank)} place yesterday!</p>
//       <button onClick={closeModal}>Close</button>
//     </Modal>
//   );
// }

// export default DailyCongrats;


// DailyCongrats.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchUsers } from '../store/allUsersStore';
import Modal from './Modal';
import { fetchSingleUser } from '../store/singleUserStore';

function DailyCongrats() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.allQuestions || []);
  const users = useSelector((state) => state.allUsers || []);
  const { id: userId, username } = useSelector((state) => state.auth);

  const [userRank, setUserRank] = useState(null);
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchUsers());
    if (userId) {
      dispatch(fetchSingleUser(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (questions.length > 0 && users.length > 0 && userId) {
      // Get yesterday's date in YYYY-MM-DD format
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toISOString().split('T')[0];

      // Create a unique key for localStorage using userId and yesterday's date
      const localStorageKey = `congratsModalShown_${userId}_${yesterdayDate}`;

      // Check if the modal has already been shown
      const modalShown = localStorage.getItem(localStorageKey);


      if (modalShown) {
        // Modal has already been shown, do nothing
        return;
      }

      // Find the question corresponding to yesterday's date
      const yesterdayQuestion = questions.find(
        (q) => q.dateAsked === yesterdayDate
      );

      if (yesterdayQuestion && yesterdayQuestion.Guesses) {
        // Create a map of userId to username and image for quick lookup
        const usersMap = {};
        users.forEach((user) => {
          usersMap[user.id] = { username: user.username, image: user.image };
        });

        const userPointsMap = {};

        yesterdayQuestion.Guesses.forEach((guess) => {
          const guessUserId = guess.userId;
          const user = usersMap[guessUserId] || {
            username: 'Unknown User',
            image: '',
          };
          const pointsEarned = guess.pointsEarned || 0;

          if (!userPointsMap[guessUserId]) {
            userPointsMap[guessUserId] = {
              userId: guessUserId,
              username: user.username,
              image: user.image,
              points: 0,
            };
          }

          userPointsMap[guessUserId].points += pointsEarned;
        });

        // Convert to array and sort by points
        let leaderboard = Object.values(userPointsMap);
        leaderboard.sort((a, b) => b.points - a.points);

        // Handle ranking with ties
        let rank = 1;
        let prevPoints = null;

        leaderboard.forEach((user, index) => {
          if (user.points !== prevPoints) {
            rank = index + 1;
          }
          user.rank = rank;
          prevPoints = user.points;
        });

        // Find the current user's rank
        const currentUserEntry = leaderboard.find(
          (entry) => entry.userId === userId
        );

        if (currentUserEntry && currentUserEntry.rank <= 3) {
          setUserRank(currentUserEntry.rank);
          setShowCongratsModal(true);

          // Set the flag in localStorage to indicate the modal has been shown
          localStorage.setItem(localStorageKey, 'true');
        }
      }
    }
  }, [questions, users, userId]);

  const closeModal = () => {
    setShowCongratsModal(false);
  };

  const getOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  if (!showCongratsModal) {
    return null;
  }

  const medalColors = {
    1: 'gold',
    2: 'silver',
    3: '#cd7f32' // Bronze color
  };

  const medalColor = medalColors[userRank] || 'gold';

  // Set the CSS variable
  // useEffect(() => {
  //   document.documentElement.style.setProperty('--medal-color', medalColor);
  // }, [medalColor]);

  const medalEmoji = getMedalEmoji(userRank);

  return (
    <Modal onClose={closeModal}>
      <h2>Congratulations, {username}!</h2>
      {medalEmoji && (
      <div className="medal-emoji">{medalEmoji}</div>
    )}
      <p>You got {getOrdinal(userRank)} place yesterday!</p>
      <button onClick={closeModal}>Close</button>
    </Modal>
  );
}

export default DailyCongrats;



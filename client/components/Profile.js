// // import React, { useState, useEffect, useMemo } from 'react';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';
// // import { fetchQuestions } from '../store/allQuestionsStore';

// // function Profile() {
// //   const dispatch = useDispatch();
// //   const { id } = useSelector((state) => state.auth);
// //   const user = useSelector((state) => state.singleUser);
// //   const questions = useSelector((state) => state.allQuestions);
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [previewUrl, setPreviewUrl] = useState(null);
// //   const [newPhoto, setNewPhoto] = useState(false);
// //   const [activeTab, setActiveTab] = useState('stats');

// //   useEffect(() => {
// //     dispatch(fetchSingleUser(id));
// //     dispatch(fetchQuestions());
// //   }, [dispatch, id]);

// //   const imageUrl = user.image;

// //   const handleFileChange = (event) => {
// //     const file = event.target.files[0];
// //     if (file) {
// //       setSelectedFile(file);
// //       setPreviewUrl(URL.createObjectURL(file));
// //     }
// //   };

// //   const handleUpload = async () => {
// //     if (!selectedFile) {
// //       alert('Please select a file to upload');
// //       return;
// //     }

// //     const formData = new FormData();
// //     formData.append('image', selectedFile);

// //     try {
// //       const uploadResponse = await fetch(`/api/users/${user.id}`, {
// //         method: 'PUT',
// //         body: formData,
// //       });

// //       if (uploadResponse.ok) {
// //         const responseData = await uploadResponse.json();
// //         dispatch(updateSingleUser({ id, image: responseData.imageUrl }));
// //         alert('Photo uploaded and profile updated successfully');
// //         setNewPhoto(false);
// //       } else {
// //         alert('Upload failed');
// //       }
// //     } catch (error) {
// //       console.error('Error uploading file:', error.response ? error.response.data : error);
// //       alert('Upload failed');
// //     }
// //   };

// //   // Statistic calculation functions remain the same...
// //   const calculateVotes = (userResponses, option) => {
// //     return userResponses.filter((response) => response.response === option).length;
// //   };

// //   const getTotalQuestionsAnswered = () => {
// //     return user.user_responses ? user.user_responses.length : 0;
// //   };

// //   const getPercentagePopularAnswers = () => {
// //     if (!user.user_responses || user.user_responses.length === 0) return 0;

// //     const popularAnswersCount = user.user_responses.reduce((count, userResponse) => {
// //       const question = questions.find((q) => q.id === userResponse.questionId);
// //       if (!question) return count;

// //       const optionAVotes = calculateVotes(question.user_responses, 'option_a');
// //       const optionBVotes = calculateVotes(question.user_responses, 'option_b');

// //       const mostPopularAnswer = optionAVotes > optionBVotes ? 'option_a' : 'option_b';

// //       return userResponse.response === mostPopularAnswer ? count + 1 : count;
// //     }, 0);

// //     return ((popularAnswersCount / user.user_responses.length) * 100).toFixed(2);
// //   };

// //   const getConsensusCount = () => {
// //     if (!user.user_responses || user.user_responses.length === 0) return 0;

// //     const consensusCount = user.user_responses.reduce((count, userResponse) => {
// //       const question = questions.find((q) => q.id === userResponse.questionId);
// //       if (!question || !question.consensus || !question.consensus.length) return count;

// //       const consensusAnswer = question.consensus[0].consensusAnswer;

// //       return userResponse.response === consensusAnswer ? count + 1 : count;
// //     }, 0);

// //     return consensusCount;
// //   };

// //   console.log("user", user)

// //   const getSoleDissenterCount = () => {
// //     if (!user.user_responses || user.user_responses.length === 0) return 0;

// //     const soleDissenterCount = user.user_responses.reduce((count, userResponse) => {
// //       const question = questions.find((q) => q.id === userResponse.questionId);
// //       if (!question) return count;

// //       const userResponseCount = calculateVotes(question.user_responses, userResponse.response);

// //       return userResponseCount === 1 ? count + 1 : count;
// //     }, 0);

// //     return soleDissenterCount;
// //   };

// //   // Compute the most recent activity
// //   const { mostRecentQuestion, userResponse, selectedImage } = useMemo(() => {
// //     if (!user || !user.user_responses || user.user_responses.length === 0) {
// //       return { mostRecentQuestion: null, userResponse: null, selectedImage: null };
// //     }

// //     const respondedQuestionIds = user.user_responses.map((response) => response.questionId);
// //     const respondedQuestionIdSet = new Set(respondedQuestionIds);

// //     const respondedQuestions = questions.filter((question) => respondedQuestionIdSet.has(question.id));

// //     if (respondedQuestions.length === 0) {
// //       return { mostRecentQuestion: null, userResponse: null, selectedImage: null };
// //     }

// //     const mostRecentQuestion = respondedQuestions.reduce((latest, current) => {
// //       const latestDate = new Date(latest.dateAsked);
// //       const currentDate = new Date(current.dateAsked);
// //       return currentDate > latestDate ? current : latest;
// //     }, respondedQuestions[0]);

// //     const userResponse = user.user_responses.find(
// //       (response) => response.questionId === mostRecentQuestion.id
// //     );

// //     if (!userResponse || !['option_a', 'option_b'].includes(userResponse.response)) {
// //       return { mostRecentQuestion, userResponse: null, selectedImage: null };
// //     }

// //     const selectedImage =
// //       userResponse.response === 'option_a' ? mostRecentQuestion.imageA : mostRecentQuestion.imageB;

// //     return { mostRecentQuestion, userResponse, selectedImage };
// //   }, [questions, user]);

// //   return (
// //     <div className="profile-container">
// //       <div className="profile-card">
// //         {/* Profile Header */}
// //         <div className="profile-header">
// //           <div className="profile-image-container">
// //             {user.image ? (
// //               <img src={imageUrl} alt={`${user.username}'s profile`} />
// //             ) : (
// //               <div className="placeholder">
// //                 <i className="fas fa-user-circle"></i>
// //               </div>
// //             )}
// //           </div>
// //           <div className="profile-info">
// //             <h2>{user.username}</h2>
// //             <button className="button change-photo-button" onClick={() => setNewPhoto(true)}>
// //               Change Photo
// //             </button>
// //           </div>
// //         </div>

// //         {/* Photo Upload Section */}
// //         {newPhoto && (
// //           <div className="upload-section">
// //             <div className="image-preview">
// //               {previewUrl ? (
// //                 <img src={previewUrl} alt="Preview" />
// //               ) : (
// //                 <div className="placeholder">
// //                   <i className="fas fa-user-circle"></i>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="button-group">
// //               <label htmlFor="file-input" className="button-common button2">
// //                 Choose a Photo
// //               </label>
// //               <input id="file-input" type="file" onChange={handleFileChange} />
// //               <button onClick={handleUpload} className="button-common button3 upload-button">
// //                 Upload Photo
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {/* Tabs */}
// //         <div className="tabs">
// //           <button
// //             className={activeTab === 'stats' ? 'tab active' : 'tab'}
// //             onClick={() => setActiveTab('stats')}
// //           >
// //             Stats
// //           </button>
// //           <button
// //             className={activeTab === 'activity' ? 'tab active' : 'tab'}
// //             onClick={() => setActiveTab('activity')}
// //           >
// //             Activity
// //           </button>
// //         </div>

// //         {/* Tab Content */}
// //         <div className="tab-content">
// //           {activeTab === 'stats' && (
// //             <div className="profile-stats">
// //               <div className="stat-item">
// //                  <i className="fas fa-question-circle"></i>
// //                  <p>Total Questions Answered</p>
// //                  <h3>{getTotalQuestionsAnswered()}</h3>
// //                </div>
// //                <div className="stat-item">
// //                  <i className="fas fa-percentage"></i>
// //                 <p>Popular Answers</p>
// //                 <div className="progress-bar">
// //                   <div className="progress"
// //                     style={{ width: `${getPercentagePopularAnswers()}%` }}
// //                   ></div>
// //                 </div>
// //                 <span>{getPercentagePopularAnswers()}%</span>
// //               </div>
// //               <div className="stat-item">
// //                 <i className="fas fa-users"></i>
// //                 <p>With Consensus</p>
// //                 <h3>{getConsensusCount()}</h3>
// //               </div>
// //               <div className="stat-item">
// //                 <i className="fas fa-user-slash"></i>
// //                 <p>Sole Dissenter</p>
// //                 <h3>{getSoleDissenterCount()}</h3>
// //               </div>
// //               <div className="stat-item">
// //                 <i className="fas fa-trophy"></i>
// //                 <p>Longest Win Streak</p>
// //                 <h3>{user.careerHighWinStreak} days</h3>
// //               </div>
// //               <div className="stat-item">
// //                 <i className="fas fa-thumbs-down"></i>
// //                 <p>Longest Loss Streak</p>
// //                 <h3>{user.careerHighLossStreak} days</h3>
// //               </div>
// //             </div>
// //           )}
// //           {activeTab === 'activity' && (
// //             <div className="activity-section">
// //               {!mostRecentQuestion ? (
// //                 <p>No recent activity to display.</p>
// //               ) : (
// //                 <div className="latest-response-container">
// //                   <h2>Most Recent Vote:</h2>
// //                   <p>
// //                     <strong>Date:</strong>{' '}
// //                     {new Date(mostRecentQuestion.dateAsked).toLocaleDateString()}
// //                   </p>
// //                   <div className="selected-image">
// //                     <img
// //                       src={selectedImage}
// //                       alt={`Your response to question ${mostRecentQuestion.id}`}
// //                       className="activity-image"
// //                     />
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Profile;

// import React, { useState, useEffect, useMemo } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';
// import { fetchQuestions } from '../store/allQuestionsStore';

// function Profile() {
//   const dispatch = useDispatch();
//   const { id } = useSelector((state) => state.auth);
//   const user = useSelector((state) => state.singleUser);
//   const questions = useSelector((state) => state.allQuestions);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [newPhoto, setNewPhoto] = useState(false);
//   const [activeTab, setActiveTab] = useState('stats');

//   useEffect(() => {
//     dispatch(fetchSingleUser(id));
//     dispatch(fetchQuestions());
//   }, [dispatch, id]);

//   const imageUrl = user.image;

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert('Please select a file to upload');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('image', selectedFile);

//     try {
//       const uploadResponse = await fetch(`/api/users/${user.id}`, {
//         method: 'PUT',
//         body: formData,
//       });

//       if (uploadResponse.ok) {
//         const responseData = await uploadResponse.json();
//         dispatch(updateSingleUser({ id, image: responseData.imageUrl }));
//         alert('Photo uploaded and profile updated successfully');
//         setNewPhoto(false);
//       } else {
//         alert('Upload failed');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error.response ? error.response.data : error);
//       alert('Upload failed');
//     }
//   };

//   const getTotalQuestionsAnswered = () => {
//     if (!user.Guesses) return 0;
//     const uniqueQuestions = new Set(user.Guesses.map((guess) => guess.questionId));
//     return uniqueQuestions.size;
//   };

//   const getCareerWins = () => {
//     if (!questions || questions.length === 0) return 0;
//     return questions.filter((q) => q.dailyWinnerId === user.id).length;
//   };

//   const getLongestLossStreak = () => {
//     if (!user.Guesses || user.Guesses.length === 0) return 0;
//     const firstAnsweredDate = new Date(Math.min(...user.Guesses.map((g) => new Date(g.createdAt))));
//     const mostRecentWin = questions.filter((q) => q.dailyWinnerId === user.id)
//       .map((q) => new Date(q.dateAsked))
//       .reduce((latest, current) => (current > latest ? current : latest), firstAnsweredDate);
//     const currentDate = new Date();
//     let diffTime = Math.abs(currentDate - mostRecentWin);
//     let streak = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
//     return streak < 0 ? 0 : streak;
// };

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         {/* Profile Header */}
//         <div className="profile-header">
//           <div className="profile-image-container">
//             {user.image ? (
//               <img src={imageUrl} alt={`${user.username}'s profile`} />
//             ) : (
//               <div className="placeholder">
//                 <i className="fas fa-user-circle"></i>
//               </div>
//             )}
//           </div>
//           <div className="profile-info">
//             <h2>{user.username}</h2>
//             <button className="button change-photo-button" onClick={() => setNewPhoto(true)}>
//               Change Photo
//             </button>
//           </div>
//         </div>

//         {/* Photo Upload Section */}
//         {newPhoto && (
//           <div className="upload-section">
//             <div className="image-preview">
//               {previewUrl ? (
//                 <img src={previewUrl} alt="Preview" />
//               ) : (
//                 <div className="placeholder">
//                   <i className="fas fa-user-circle"></i>
//                 </div>
//               )}
//             </div>

//             <div className="button-group">
//               <label htmlFor="file-input" className="button-common button2">
//                 Choose a Photo
//               </label>
//               <input id="file-input" type="file" onChange={handleFileChange} />
//               <button onClick={handleUpload} className="button-common button3 upload-button">
//                 Upload Photo
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="tabs">
//           <button
//             className={activeTab === 'stats' ? 'tab active' : 'tab'}
//             onClick={() => setActiveTab('stats')}
//           >
//             Stats
//           </button>
//           <button
//             className={activeTab === 'activity' ? 'tab active' : 'tab'}
//             onClick={() => setActiveTab('activity')}
//           >
//             Activity
//           </button>
//         </div>

//         {/* Tab Content */}
//         <div className="tab-content">
//           {activeTab === 'stats' && (
//             <div className="profile-stats">
//               <div className="stat-item">
//                 <i className="fas fa-coins"></i>
//                 <p>Career Points</p>
//                 <h3>{user.totalPoints}</h3>
//               </div>
//               <div className="stat-item">
//                 <i className="fas fa-question-circle"></i>
//                 <p>Total Questions Answered</p>
//                 <h3>{getTotalQuestionsAnswered()}</h3>
//               </div>
//               <div className="stat-item">
//                 <i className="fas fa-trophy"></i>
//                 <p>Career Wins</p>
//                 <h3>{getCareerWins()}</h3>
//               </div>
//               <div className="stat-item">
//                 <i className="fas fa-calendar-times"></i>
//                 <p>Longest Loss Streak</p>
//                 <h3>{getLongestLossStreak()} days</h3>
//               </div>
//               <div className="stat-item">
//                 <i className="fas fa-calendar-times"></i>
//                 <p>Overall Rank</p>
//                 <h3></h3>
//               </div>
//             </div>
//           )}
//           {activeTab === 'activity' && (
//             <div className="activity-section">
//               <p>No recent activity to display.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchUsers } from '../store/allUsersStore';

function Profile() {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.singleUser);
  const questions = useSelector((state) => state.allQuestions);
  const users = useSelector((state) => state.allUsers || []);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newPhoto, setNewPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    dispatch(fetchSingleUser(id));
    dispatch(fetchQuestions());
    dispatch(fetchUsers());
  }, [dispatch, id]);

  const imageUrl = user.image;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const uploadResponse = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (uploadResponse.ok) {
        const responseData = await uploadResponse.json();
        dispatch(updateSingleUser({ id, image: responseData.imageUrl }));
        alert('Photo uploaded and profile updated successfully');
        setNewPhoto(false);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error);
      alert('Upload failed');
    }
  };

  const getTotalQuestionsAnswered = () => {
    if (!user.Guesses) return 0;
    const uniqueQuestions = new Set(user.Guesses.map((guess) => guess.questionId));
    return uniqueQuestions.size;
  };

  const getCareerWins = () => {
    if (!questions || questions.length === 0) return 0;
    return questions.filter((q) => q.dailyWinnerId === user.id).length;
  };

  const getLongestLossStreak = () => {
    if (!user.Guesses || user.Guesses.length === 0) return 0;
    const firstAnsweredDate = new Date(Math.min(...user.Guesses.map((g) => new Date(g.createdAt))));
    const mostRecentWin = questions.filter((q) => q.dailyWinnerId === user.id)
      .map((q) => new Date(q.dateAsked))
      .reduce((latest, current) => (current > latest ? current : latest), firstAnsweredDate);
    const currentDate = new Date();
    let diffTime = Math.abs(currentDate - mostRecentWin);
    let streak = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
    return streak < 0 ? 0 : streak;
  };

  const getOverallRank = () => {
    // Sort users by totalPoints
    const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

    // Assign ranks
    let rank = 1;
    let prevPoints = null;

    for (let i = 0; i < sortedUsers.length; i++) {
      if (sortedUsers[i].totalPoints !== prevPoints) {
        rank = i + 1;
      }
      if (sortedUsers[i].id === user.id) {
        return { rank, isTopThree: rank <= 3 };
      }
      prevPoints = sortedUsers[i].totalPoints;
    }

    return { rank: null, isTopThree: false };
  };

  const { rank, isTopThree } = getOverallRank();

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image-container">
            {user.image ? (
              <img src={imageUrl} alt={`${user.username}'s profile`} />
            ) : (
              <div className="placeholder">
                <i className="fas fa-user-circle"></i>
              </div>
            )}
          </div>
          <div className="profile-info">
            <h2>{user.username}</h2>
            <button className="button change-photo-button" onClick={() => setNewPhoto(true)}>
              Change Photo
            </button>
          </div>
        </div>

        {/* Photo Upload Section */}
        {newPhoto && (
          <div className="upload-section">
            <div className="image-preview">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" />
              ) : (
                <div className="placeholder">
                  <i className="fas fa-user-circle"></i>
                </div>
              )}
            </div>

            <div className="button-group">
              <label htmlFor="file-input" className="button-common button2">
                Choose a Photo
              </label>
              <input id="file-input" type="file" onChange={handleFileChange} />
              <button onClick={handleUpload} className="button-common button3 upload-button">
                Upload Photo
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === 'stats' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
          <button
            className={activeTab === 'activity' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'stats' && (
            <div className="profile-stats">
              <div className="stat-item">
                <i className="fas fa-coins"></i>
                <p>Career Points</p>
                <h3>{user.totalPoints}</h3>
              </div>
              <div className="stat-item">
                <i className="fas fa-question-circle"></i>
                <p>Total Questions Answered</p>
                <h3>{getTotalQuestionsAnswered()}</h3>
              </div>
              <div className="stat-item">
                <i className="fas fa-trophy"></i>
                <p>Career Wins</p>
                <h3>{getCareerWins()}</h3>
              </div>
              <div className="stat-item">
                <i className="fas fa-calendar-times"></i>
                <p>Longest Loss Streak</p>
                <h3>{getLongestLossStreak()} days</h3>
              </div>
              <div className="stat-item">
                <i className="fas fa-medal"></i>
                <p>Overall Rank</p>
                <h3>
                  {rank}
                  {isTopThree && (
                    <span className="medal">
                      {rank === 1 && ' 🥇'}
                      {rank === 2 && ' 🥈'}
                      {rank === 3 && ' 🥉'}
                    </span>
                  )}
                </h3>
              </div>
            </div>
          )}
          {activeTab === 'activity' && (
            <div className="activity-section">
              <p>No recent activity to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

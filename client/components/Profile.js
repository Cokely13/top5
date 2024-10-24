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
  const [mostRecentPoints, setMostRecentPoints] = useState(0);
  const [mostRecentRank, setMostRecentRank] = useState(null);

  useEffect(() => {
    dispatch(fetchSingleUser(id));
    dispatch(fetchQuestions());
    dispatch(fetchUsers());
  }, [dispatch, id]);

  useEffect(() => {
    if (user && user.Guesses && questions.length > 0) {
      // Find the most recent question the user answered
      const mostRecentGuess = user.Guesses.reduce((latest, current) => {
        return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
      }, user.Guesses[0]);

      if (mostRecentGuess) {
        const question = questions.find((q) => q.id === mostRecentGuess.questionId);

        if (question && question.Guesses) {
          const userPointsMap = {};

          question.Guesses.forEach((guess) => {
            if (!userPointsMap[guess.userId]) {
              userPointsMap[guess.userId] = 0;
            }
            userPointsMap[guess.userId] += guess.pointsEarned;
          });

          // Convert to array and sort by points
          const leaderboard = Object.entries(userPointsMap).map(([userId, points]) => ({
            userId: Number(userId),
            points,
          }));
          leaderboard.sort((a, b) => b.points - a.points);

          // Assign ranks
          let rank = 1;
          let prevPoints = null;

          leaderboard.forEach((entry, index) => {
            if (entry.points !== prevPoints) {
              rank = index + 1;
            }
            if (entry.userId === user.id) {
              setMostRecentPoints(entry.points);
              setMostRecentRank(rank);
            }
            prevPoints = entry.points;
          });
        }
      }
    }
  }, [user, questions]);

  const imageUrl = user.image;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  console.log("users", user)

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
                <h3>{user.wins}</h3>
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
              {mostRecentPoints ? (
                <div className="recent-activity">
                  <h3>Most Recent Activity</h3>
                  <div className="stat-item">
                <i className="fas fa-coins"></i>
                <p>Points Scored:</p>
                <h3>{mostRecentPoints}</h3>
              </div>
              <div className="stat-item">
              <i className="fas fa-medal"></i>
                <p>Rank for the Day:</p>
                <h3>{mostRecentRank}</h3>
              </div>
                  {/* <p>Points Scored: {mostRecentPoints}</p>
                  <p>Rank for the Day: {mostRecentRank}</p> */}
                </div>
              ) : (
                <p>No recent activity to display.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

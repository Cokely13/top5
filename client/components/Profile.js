import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';
import { fetchQuestions } from '../store/allQuestionsStore';

function Profile() {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.singleUser);
  const questions = useSelector((state) => state.allQuestions);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newPhoto, setNewPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    dispatch(fetchSingleUser(id));
    dispatch(fetchQuestions());
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

  // Statistic calculation functions remain the same...
  const calculateVotes = (userResponses, option) => {
    return userResponses.filter((response) => response.response === option).length;
  };

  const getTotalQuestionsAnswered = () => {
    return user.user_responses ? user.user_responses.length : 0;
  };

  const getPercentagePopularAnswers = () => {
    if (!user.user_responses || user.user_responses.length === 0) return 0;

    const popularAnswersCount = user.user_responses.reduce((count, userResponse) => {
      const question = questions.find((q) => q.id === userResponse.questionId);
      if (!question) return count;

      const optionAVotes = calculateVotes(question.user_responses, 'option_a');
      const optionBVotes = calculateVotes(question.user_responses, 'option_b');

      const mostPopularAnswer = optionAVotes > optionBVotes ? 'option_a' : 'option_b';

      return userResponse.response === mostPopularAnswer ? count + 1 : count;
    }, 0);

    return ((popularAnswersCount / user.user_responses.length) * 100).toFixed(2);
  };

  const getConsensusCount = () => {
    if (!user.user_responses || user.user_responses.length === 0) return 0;

    const consensusCount = user.user_responses.reduce((count, userResponse) => {
      const question = questions.find((q) => q.id === userResponse.questionId);
      if (!question || !question.consensus || !question.consensus.length) return count;

      const consensusAnswer = question.consensus[0].consensusAnswer;

      return userResponse.response === consensusAnswer ? count + 1 : count;
    }, 0);

    return consensusCount;
  };

  const getSoleDissenterCount = () => {
    if (!user.user_responses || user.user_responses.length === 0) return 0;

    const soleDissenterCount = user.user_responses.reduce((count, userResponse) => {
      const question = questions.find((q) => q.id === userResponse.questionId);
      if (!question) return count;

      const userResponseCount = calculateVotes(question.user_responses, userResponse.response);

      return userResponseCount === 1 ? count + 1 : count;
    }, 0);

    return soleDissenterCount;
  };

  // Compute the most recent activity
  const { mostRecentQuestion, userResponse, selectedImage } = useMemo(() => {
    if (!user || !user.user_responses || user.user_responses.length === 0) {
      return { mostRecentQuestion: null, userResponse: null, selectedImage: null };
    }

    const respondedQuestionIds = user.user_responses.map((response) => response.questionId);
    const respondedQuestionIdSet = new Set(respondedQuestionIds);

    const respondedQuestions = questions.filter((question) => respondedQuestionIdSet.has(question.id));

    if (respondedQuestions.length === 0) {
      return { mostRecentQuestion: null, userResponse: null, selectedImage: null };
    }

    const mostRecentQuestion = respondedQuestions.reduce((latest, current) => {
      const latestDate = new Date(latest.dateAsked);
      const currentDate = new Date(current.dateAsked);
      return currentDate > latestDate ? current : latest;
    }, respondedQuestions[0]);

    const userResponse = user.user_responses.find(
      (response) => response.questionId === mostRecentQuestion.id
    );

    if (!userResponse || !['option_a', 'option_b'].includes(userResponse.response)) {
      return { mostRecentQuestion, userResponse: null, selectedImage: null };
    }

    const selectedImage =
      userResponse.response === 'option_a' ? mostRecentQuestion.imageA : mostRecentQuestion.imageB;

    return { mostRecentQuestion, userResponse, selectedImage };
  }, [questions, user]);

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
                 <i className="fas fa-question-circle"></i>
                 <p>Total Questions Answered</p>
                 <h3>{getTotalQuestionsAnswered()}</h3>
               </div>
               <div className="stat-item">
                 <i className="fas fa-percentage"></i>
                <p>Popular Answers</p>
                <div className="progress-bar">
                  <div className="progress"
                    style={{ width: `${getPercentagePopularAnswers()}%` }}
                  ></div>
                </div>
                <span>{getPercentagePopularAnswers()}%</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-users"></i>
                <p>With Consensus</p>
                <h3>{getConsensusCount()}</h3>
              </div>
              <div className="stat-item">
                <i className="fas fa-user-slash"></i>
                <p>Sole Dissenter</p>
                <h3>{getSoleDissenterCount()}</h3>
              </div>
              <div className="stat-item">
                <i className="fas fa-trophy"></i>
                <p>Longest Win Streak</p>
                <h3>{user.careerHighWinStreak} days</h3>
              </div>
              <div className="stat-item">
                <i className="fas fa-thumbs-down"></i>
                <p>Longest Loss Streak</p>
                <h3>{user.careerHighLossStreak} days</h3>
              </div>
            </div>
          )}
          {activeTab === 'activity' && (
            <div className="activity-section">
              {!mostRecentQuestion ? (
                <p>No recent activity to display.</p>
              ) : (
                <div className="latest-response-container">
                  <h2>Most Recent Vote:</h2>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(mostRecentQuestion.dateAsked).toLocaleDateString()}
                  </p>
                  <div className="selected-image">
                    <img
                      src={selectedImage}
                      alt={`Your response to question ${mostRecentQuestion.id}`}
                      className="activity-image"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUsers } from '../store/allUsersStore';
import { fetchQuestions } from '../store/allQuestionsStore';

function UserDetailPage() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { id: mainUserId } = useSelector((state) => state.auth);
  const users = useSelector((state) => state.allUsers);
  const questions = useSelector((state) => state.allQuestions);
  const [selectedUser, setSelectedUser] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(0);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (users.length > 0) {
      const foundUser = users.find((user) => user.id === Number(userId));
      setSelectedUser(foundUser);
    }
  }, [users, userId]);

  useEffect(() => {
    if (selectedUser && selectedUser.user_responses && questions.length > 0) {
      const mainUser = users.find((user) => user.id === mainUserId);

      if (!mainUser || !mainUser.user_responses) return;

      // Create a Set of question IDs both users have answered
      const answeredByMainUser = new Set(
        mainUser.user_responses.map((response) => response.questionId)
      );
      const answeredByOtherUser = new Set(
        selectedUser.user_responses.map((response) => response.questionId)
      );

      // Get the intersection of the two sets to find common questions
      const commonQuestionIds = [...answeredByMainUser].filter((questionId) =>
        answeredByOtherUser.has(questionId)
      );

      // Calculate similarity score
      const sameAnswersCount = commonQuestionIds.reduce((count, questionId) => {
        const mainUserResponse = mainUser.user_responses.find(
          (response) => response.questionId === questionId
        );
        const otherUserResponse = selectedUser.user_responses.find(
          (response) => response.questionId === questionId
        );

        return mainUserResponse.response === otherUserResponse.response ? count + 1 : count;
      }, 0);

      const similarity =
        commonQuestionIds.length > 0
          ? ((sameAnswersCount / commonQuestionIds.length) * 100).toFixed(2)
          : 0;
      setSimilarityScore(similarity);
    }
  }, [selectedUser, users, questions, mainUserId]);

  const getTotalQuestionsAnswered = () => {
    if (!selectedUser.Guesses) return 0;
    const uniqueQuestions = new Set(selectedUser.Guesses.map((guess) => guess.questionId));
    return uniqueQuestions.size;
  };



const getOverallRank = () => {
  // Ensure selectedUser is defined before proceeding
  if (!selectedUser) {
    return { rank: null, isTopThree: false };
  }

  // Sort users by totalPoints
  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

  // Assign ranks
  let rank = 1;
  let prevPoints = null;

  for (let i = 0; i < sortedUsers.length; i++) {
    if (sortedUsers[i].totalPoints !== prevPoints) {
      rank = i + 1;
    }
    if (sortedUsers[i].id === selectedUser.id) {
      return { rank, isTopThree: rank <= 3 };
    }
    prevPoints = sortedUsers[i].totalPoints;
  }

  return { rank: null, isTopThree: false };
};


  const { rank, isTopThree } = getOverallRank();



  return (
    <div className="user-detail-page-container">
      {selectedUser ? (
        <div className="userdetail-detail-card">
          <div className="userdetail-detail-header">
            <div className="userdetail-image-container">
              {selectedUser && selectedUser.image ? (
                <img src={selectedUser.image} alt={selectedUser.username} />
              ) : (
                <div className="placeholder">
                  <i className="fas fa-user-circle"></i>
                </div>
              )}
            </div>
            <h2 className="userdetail-detail-page-heading">{selectedUser.username}'s Profile</h2>
          </div>
          <div className="userdetail-detail-stats">
            <div className="userdetailstat-item">
              <i className="fas fa-coins"></i>
              <p>Career Points</p>
              <h3>{selectedUser.totalPoints}</h3>
            </div>
            <div className="userdetailstat-item">
              <i className="fas fa-trophy"></i>
              <p>Career Wins</p>
              <h3>{selectedUser.wins}</h3>
            </div>
            <div className="userdetailstat-item">
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
            <div className="userdetailstat-item">
              <i className="fas fa-question-circle"></i>
              <p>Total Questions Answered</p>
              <h3>{getTotalQuestionsAnswered()}</h3>
            </div>
          </div>
        </div>
      ) : (
        <p className="userdetailloading-message">Loading user data...</p>
      )}
    </div>
  );
}

export default UserDetailPage;

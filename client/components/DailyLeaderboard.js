import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchUsers } from '../store/allUsersStore';

function DailyLeaderboard() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.allQuestions || []);
  const users = useSelector((state) => state.allUsers || []);

  // State for selected date
  const todayDate = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayDate);

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Create a map of userId to username and image for quick lookup
  const usersMap = {};
  users.forEach((user) => {
    usersMap[user.id] = { username: user.username, image: user.image };
  });

  // Find the question corresponding to the selected date
  const selectedQuestion =
    questions.find((q) => q.dateAsked === selectedDate) || null;

  // Initialize leaderboard data
  let leaderboard = [];

  if (selectedQuestion && selectedQuestion.Guesses && users.length > 0) {
    const userPointsMap = {};

    selectedQuestion.Guesses.forEach((guess) => {
      const userId = guess.userId;
      const user = usersMap[userId] || { username: 'Unknown User', image: '' };
      const pointsEarned = guess.pointsEarned || 0;

      if (!userPointsMap[userId]) {
        userPointsMap[userId] = {
          userId,
          username: user.username,
          image: user.image,
          points: 0,
        };
      }

      userPointsMap[userId].points += pointsEarned;
    });

    // Convert to array and sort by points
    leaderboard = Object.values(userPointsMap);
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
  }

  // Generate options for the date dropdown
  // const dateOptions = questions.map((question) => ({
  //   dateAsked: question.dateAsked,
  //   formattedDate: new Date(question.dateAsked).toLocaleDateString(),
  // }));

  const dateOptions = questions
  .filter((question) => question.expired || question.dateAsked === todayDate)
  .map((question) => ({
    dateAsked: question.dateAsked,
    formattedDate: new Date(question.dateAsked).toLocaleDateString(),
  }));

  // Remove duplicate dates if there are multiple questions on the same date
  const uniqueDateOptions = Array.from(
    new Set(dateOptions.map((item) => item.dateAsked))
  ).map((date) => {
    const formattedDate = new Date(date).toLocaleDateString();
    return { dateAsked: date, formattedDate };
  });

  // Sort the dates in descending order
  uniqueDateOptions.sort((a, b) => new Date(b.dateAsked) - new Date(a.dateAsked));

  // Render the leaderboard
  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-heading">
        Leaderboard for {new Date(selectedDate).toLocaleDateString()}
      </h2>

      {/* Date Selection Dropdown */}
      <div className="date-selection">
        <label htmlFor="date-select">Select Date: </label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {uniqueDateOptions.map((option) => (
            <option key={option.dateAsked} value={option.dateAsked}>
              {option.formattedDate}
            </option>
          ))}
        </select>
      </div>

      {/* Display Question Text */}
      {selectedQuestion ? (
        <div className="question-text">
          <p>{selectedQuestion.text}</p>
        </div>
      ) : (
        <div className="no-question">
          <p>No Question</p>
        </div>
      )}

      {leaderboard.length > 0 ? (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Rank</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user) => (
              <tr key={user.userId}>
                <td>
  <div className="user-info">
    <img src={user.image} alt={user.username} className="user-img" />
    <span className="username">{user.username}</span>
  </div>
</td>
                <td style={{ textAlign: 'center' }}>{user.rank}</td>
                <td style={{ textAlign: 'center' }}>{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-guesses">No guesses have been made for this date.</p>
      )}
    </div>
  );
}

export default DailyLeaderboard;

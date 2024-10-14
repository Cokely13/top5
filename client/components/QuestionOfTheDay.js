// components/QuestionOfTheDay.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchUsers } from '../store/allUsersStore';
import { fetchSingleUser } from '../store/singleUserStore';
import { fetchGuesses, createGuess } from '../store/allGuessesStore';
import TodaysLeaderboard from './TodaysLeaderboard'; // Import the leaderboard component


function QuestionOfTheDay() {
  const dispatch = useDispatch();

  // Selectors
  const questions = useSelector((state) => state.allQuestions || []);
  const users = useSelector((state) => state.allUsers || []);
  const { id: userId } = useSelector((state) => state.auth); // Ensure userId is available
  const user = useSelector((state) => state.singleUser);
  const guesses = useSelector((state) => state.guesses || []);

  // Local State
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [rankedAnswers, setRankedAnswers] = useState(Array(10).fill('')); // 10 blank slots
  const [strikes, setStrikes] = useState(0);
  const maxStrikes = 3; // Define maximum strikes allowed
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchUsers());
    if (userId) {
      dispatch(fetchSingleUser(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (questions.length > 0) {
      // Select today's question based on dateAsked
      const todayDate = new Date().toISOString().split('T')[0];
      const todayQuestion = questions.find(
        (q) => q.dateAsked === todayDate
      ) || questions[0]; // Fallback to the first question
      setSelectedQuestion(todayQuestion);

      // Fetch all guesses
      dispatch(fetchGuesses());
    }
  }, [questions, dispatch]);

  useEffect(() => {
    if (selectedQuestion && guesses.length > 0) {
      // Filter guesses for the current user and current question
      const userGuesses = guesses.filter(
        (guess) => guess.userId === userId && guess.questionId === selectedQuestion.id
      );

      // Initialize rankedAnswers and strikes
      const newRankedAnswers = Array(10).fill('');
      let newStrikes = 0;

      userGuesses.forEach((guess) => {
        if (guess.guess) {
          const matchedAnswer = selectedQuestion.answers.find(
            (ans) => ans.text.toLowerCase() === guess.guess.toLowerCase()
          );

          if (matchedAnswer) {
            const rankIndex = matchedAnswer.rank - 1;
            newRankedAnswers[rankIndex] = matchedAnswer.text;
          }
        }

        if (guess.strikes) {
          newStrikes += guess.strikes;
        }
      });

      setRankedAnswers(newRankedAnswers);
      setStrikes(newStrikes);
    }
  }, [guesses, selectedQuestion, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    const trimmedAnswer = userAnswer.trim().toLowerCase();
    if (trimmedAnswer === '') {
      setFeedbackMessage('Please enter a valid answer.');
      return;
    }

    try {
      // Dispatch createGuess and wait for the created guess
      const createdGuess = await dispatch(createGuess({
        guess: userAnswer.trim(),
        userId: userId,
        questionId: selectedQuestion.id,
      }));

      if (createdGuess) {
        const matchedAnswer = selectedQuestion.answers.find(
          (ans) => ans.text.toLowerCase() === createdGuess.guess.toLowerCase()
        );

        if (matchedAnswer) {
          // Correct guess
          setFeedbackMessage(`Correct! You earned ${createdGuess.pointsEarned} points.`);
        } else {
          // Incorrect guess
          setFeedbackMessage(`Incorrect. You have ${createdGuess.strikes} strike(s).`);
        }

        // Update strikes
        setStrikes((prev) => prev + createdGuess.strikes);

        // Update rankedAnswers if correct
        if (matchedAnswer) {
          const rankIndex = matchedAnswer.rank - 1;
          setRankedAnswers((prev) => {
            const updated = [...prev];
            updated[rankIndex] = matchedAnswer.text;
            return updated;
          });
        }

        // Check if strikes exceed max
        if (strikes + createdGuess.strikes >= maxStrikes) {
          // Reveal all answers
          const allAnswers = selectedQuestion.answers.map((ans) => ans.text);
          setRankedAnswers(allAnswers);
          setFeedbackMessage('You have reached the maximum number of strikes. All answers are revealed.');
        }
      }
    } catch (error) {
      console.error('Error submitting guess:', error);
      setFeedbackMessage('An error occurred while submitting your guess.');
    }

    setUserAnswer('');
  };

  useEffect(() => {
    if (strikes >= maxStrikes && selectedQuestion) {
      const allAnswers = selectedQuestion.answers.map((ans) => ans.text);
      setRankedAnswers(allAnswers);
    }
  }, [strikes, maxStrikes, selectedQuestion]);

  // Optional: Reset feedback message after a delay
  useEffect(() => {
    if (feedbackMessage !== '') {
      const timer = setTimeout(() => {
        setFeedbackMessage('');
      }, 3000); // Clear message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  return (
    <div className="qotd-container">
      {selectedQuestion ? (
        <>
          <div className="qotd-question-section">
            <h2 className="qotd-heading">Question of the Day</h2>
            <p className="qotd-date">{new Date(selectedQuestion.dateAsked).toLocaleDateString()}</p>
            <p className="qotd-text">{selectedQuestion.text}</p>

            {/* Display Ranked Answers */}
            <div className="qotd-ranked-answers">
              <h3>Ranked Answers:</h3>
              <div className="ranked-answers-list">
                {rankedAnswers.map((answer, index) => (
                  <div key={index} className="ranked-answer-item">
                    <span className="rank-number">{index + 1}.</span>
                    <span className="rank-answer">{answer || '__________'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Display Strikes */}
            <div className="qotd-strikes">
              <p>Strikes: {strikes} / {maxStrikes}</p>
              {strikes >= maxStrikes && (
                <p className="strike-warning">
                  You have reached the maximum number of strikes. All answers are revealed.
                </p>
              )}
            </div>

            {/* Answer Input */}
            {strikes < maxStrikes && (
              <form onSubmit={handleSubmit} className="qotd-answer-form">
                <label htmlFor="userAnswer">Enter your answer:</label>
                <input
                  type="text"
                  id="userAnswer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  required
                  className="qotd-answer-input"
                  placeholder="Type your answer here..."
                />
                <button type="submit" className="qotd-submit-button">Submit</button>
              </form>
            )}

            {/* Feedback Message */}
            {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
          </div>

          {/* Leaderboard Section */}
          <TodaysLeaderboard />
        </>
      ) : (
        <div className="qotd-no-question">
          {questions.length > 0 ? 'No question for today.' : 'Loading questions...'}
        </div>
      )}
    </div>
  );
}

export default QuestionOfTheDay;

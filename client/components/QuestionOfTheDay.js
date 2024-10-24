import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchSingleUser } from '../store/singleUserStore';
import { fetchUsers } from '../store/allUsersStore';
import { createGuess } from '../store/allGuessesStore';
import TodaysLeaderboard from './TodaysLeaderboard';

function QuestionOfTheDay() {
  const dispatch = useDispatch();

  // Selectors
  const questions = useSelector((state) => state.allQuestions || []);
  const { id: userId } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.singleUser);
  const users = useSelector((state) => state.allUsers || []);

  // Local State
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [rankedAnswers, setRankedAnswers] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      text: '__________',
      guessed: false,
      revealed: false,
      rank: index + 1,
    }))
  );
  const [strikes, setStrikes] = useState(0);
  const maxStrikes = 3;
  const [currentStrike, setCurrentStrike] = useState(0); // New state variable
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [allAnswersGuessed, setAllAnswersGuessed] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [showRedX, setShowRedX] = useState(false);
  const [showRankOverlay, setShowRankOverlay] = useState(null);
  const timeoutIdRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchUsers());
    if (userId) {
      dispatch(fetchSingleUser(userId));
    }
  }, [dispatch, userId]);

  // Set selected question
  useEffect(() => {
    if (questions.length > 0) {
      const todayDate = new Date().toISOString().split('T')[0];
      const todayQuestion =
        questions.find((q) => q.dateAsked === todayDate) || questions[0];
      setSelectedQuestion(todayQuestion);
    }
  }, [questions]);

  // Reconstruct rankedAnswers, strikes, and userScore
  useEffect(() => {
    if (selectedQuestion && user && user.Guesses && selectedQuestion.answers) {
      const userGuesses = user.Guesses.filter(
        (guess) => guess.questionId === selectedQuestion.id
      );

      const newRankedAnswers = Array.from({ length: 10 }, (_, index) => ({
        text: '__________',
        guessed: false,
        revealed: false,
        rank: index + 1,
      }));

      let newStrikes = 0;
      let totalPoints = 0;

      userGuesses.forEach((guess) => {
        const matchedAnswer = selectedQuestion.answers.find(
          (ans) => ans.text.toLowerCase() === guess.guess.toLowerCase()
        );

        if (matchedAnswer) {
          const rankIndex = matchedAnswer.rank - 1;
          newRankedAnswers[rankIndex] = {
            text: matchedAnswer.text,
            guessed: true,
            revealed: false,
            rank: matchedAnswer.rank,
          };

          // Add points earned for this correct guess
          totalPoints += guess.pointsEarned || 0;
        } else {
          newStrikes += 1;
        }
      });

      if (newStrikes >= maxStrikes) {
        // Set all unguessed answers as revealed
        selectedQuestion.answers.forEach((answer) => {
          const rankIndex = answer.rank - 1;
          if (!newRankedAnswers[rankIndex].guessed) {
            newRankedAnswers[rankIndex] = {
              text: answer.text,
              guessed: false,
              revealed: true,
              rank: answer.rank,
            };
          }
        });
      }

      setRankedAnswers(newRankedAnswers);
      setStrikes(newStrikes);
      setUserScore(totalPoints);

      // Check if all answers have been guessed
      const allGuessed = newRankedAnswers.every((answer) => answer.guessed);
      setAllAnswersGuessed(allGuessed);
    }
  }, [user, selectedQuestion]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) return;
    setFeedbackMessage('');

    const trimmedAnswer = userAnswer.trim();
    if (trimmedAnswer === '') {
      setFeedbackMessage('Please enter a valid answer.');
      return;
    }

    // Find the matched answer
    const matchedAnswer = selectedQuestion.answers.find(
      (ans) => ans.text.toLowerCase() === trimmedAnswer.toLowerCase()
    );

    const isCorrect = !!matchedAnswer;

    // Check if the user has already guessed this answer
    const existingGuess = user.Guesses.find(
      (guess) =>
        guess.questionId === selectedQuestion.id &&
        guess.guess.toLowerCase() === trimmedAnswer.toLowerCase()
    );

    if (existingGuess) {
      setFeedbackMessage('You have already guessed this answer.');
      return;
    }

    try {
      // Dispatch createGuess and wait for the created guess
      await dispatch(
        createGuess({
          guess: trimmedAnswer,
          userId: userId,
          questionId: selectedQuestion.id,
        })
      );

      // Re-fetch the user's data to update guesses
      await dispatch(fetchQuestions());
      await dispatch(fetchSingleUser(userId));
      await dispatch(fetchUsers()); // Re-fetch users to update leaderboard

      if (matchedAnswer) {
        // Correct guess
        if (matchedAnswer.rank <= 5) {
          // It's a top 5 answer

          setShowRankOverlay(
            `#${matchedAnswer.rank} Answer${'!'.repeat(6 - matchedAnswer.rank)}`
          );
          // Clear any existing timeout
          if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
          }
          timeoutIdRef.current = setTimeout(() => {
            setShowRankOverlay(null);
          }, 3000);
        } else {
          // Ranks 6-10
          setFeedbackMessage(`You found answer #${matchedAnswer.rank}.`);
        }
      } else {
        // Incorrect guess
        setShowRedX(true);
        setCurrentStrike(strikes + 1); // Update currentStrike

        // Clear any existing timeout
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
          setShowRedX(false);
          setCurrentStrike(0); // Reset currentStrike after displaying
        }, 3000);
      }

      setUserAnswer('');
    } catch (error) {
      console.error('Error submitting guess:', error);
      setFeedbackMessage('An error occurred while submitting your guess.');
    }
  };

  return (
    <div className="qotd-container">
      {showRedX && (
        <div className="red-x-overlay">
          <div className="strike-message">Strike {currentStrike}!</div>
          <div className="red-x">X</div>
        </div>
      )}
      {showRankOverlay && (
        <div className="rank-overlay">
          <div className="rank-message">{showRankOverlay}</div>
        </div>
      )}
      <div className="Todayleaderboard-container">
        <TodaysLeaderboard />
      </div>
      {selectedQuestion ? (
        <>
          <div className="qotd-question-section">
            <p className="qotd-text">{selectedQuestion.text}</p>

            {/* Display Ranked Answers */}
            <div className="qotd-ranked-answers">
              <div className="ranked-answers-list">
                {rankedAnswers.map((answerObj, index) => (
                  <div key={index} className="ranked-answer-item">
                    <span className="rank-number">{index + 1}.</span>
                    <div
                      className={`rank-answer-bubble ${
                        answerObj.guessed
                          ? answerObj.rank <= 5
                            ? 'guessed-top5'
                            : 'guessed'
                          : answerObj.revealed
                          ? 'revealed'
                          : 'empty'
                      }`}
                    >
                      {answerObj.text !== '__________' ? answerObj.text : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer Input */}
            {!allAnswersGuessed && strikes < maxStrikes ? (
              <form onSubmit={handleSubmit} className="qotd-answer-form">
                <label htmlFor="userAnswer">Enter your answer:</label>
                <div className="input-group">
                  <input
                    type="text"
                    id="userAnswer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    required
                    className="qotd-answer-input"
                    placeholder="Type your answer here..."
                  />
                  <button type="submit" className="qotd-submit-button">
                    Submit
                  </button>
                </div>
              </form>
            ) : allAnswersGuessed ? (
              <p className="congrats-message">Congrats! You got all the answers!</p>
            ) : null}

            {/* Feedback Message */}
            {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

            {/* User Score */}
            <div className="qotd-user-score">
              <p>
                <i className="fas fa-star"></i> Your Score: <strong>{userScore}</strong>
              </p>
            </div>

            {/* Display Strikes */}
            <div className="qotd-strikes">
              <p>
                <i className="fas fa-times-circle"></i> Strikes:{' '}
                <strong>
                  {strikes} / {maxStrikes}
                </strong>
              </p>
              {strikes >= maxStrikes && (
                <p className="strike-warning">
                  You have reached the maximum number of strikes.
                </p>
              )}
            </div>
          </div>
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

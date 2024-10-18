import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchSingleUser } from '../store/singleUserStore';
import { createGuess } from '../store/allGuessesStore';
import Fuse from 'fuse.js';

function QuestionOfTheDay() {
  const dispatch = useDispatch();

  // Selectors
  const questions = useSelector((state) => state.allQuestions || []);
  const { id: userId } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.singleUser);

  // Local State
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [rankedAnswers, setRankedAnswers] = useState(
    Array.from({ length: 10 }, () => ({ text: '__________', guessed: false, revealed: false }))
  );
  const [strikes, setStrikes] = useState(0);
  const maxStrikes = 3;
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [allAnswersGuessed, setAllAnswersGuessed] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [showRedX, setShowRedX] = useState(false);
  const timeoutIdRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchQuestions());
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

      const newRankedAnswers = Array.from({ length: 10 }, () => ({ text: '__________', guessed: false, revealed: false }));

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
            // If the user didn't guess this answer, mark it as revealed
            newRankedAnswers[rankIndex] = {
              text: answer.text,
              guessed: false,
              revealed: true,
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!selectedQuestion) return;
  //   setFeedbackMessage('');

  //   const trimmedAnswer = userAnswer.trim();
  //   if (trimmedAnswer === '') {
  //     setFeedbackMessage('Please enter a valid answer.');
  //     return;
  //   }

  //   const isCorrect = selectedQuestion.answers.some(
  //     (ans) => ans.text.toLowerCase() === trimmedAnswer.toLowerCase()
  //   );

  //   // Check if the user has already guessed this answer
  //   const existingGuess = user.Guesses.find(
  //     (guess) =>
  //       guess.questionId === selectedQuestion.id &&
  //       guess.guess.toLowerCase() === trimmedAnswer.toLowerCase()
  //   );

  //   if (existingGuess) {
  //     setFeedbackMessage('You have already guessed this answer.');
  //     return;
  //   }

  //   try {
  //     // Dispatch createGuess and wait for the created guess
  //     await dispatch(
  //       createGuess({
  //         guess: trimmedAnswer,
  //         userId: userId,
  //         questionId: selectedQuestion.id,
  //       })
  //     );

  //     // Re-fetch the user's data to update guesses
  //     await dispatch(fetchSingleUser(userId));

  //     if (!isCorrect) {
  //       setShowRedX(true);
  //       // Clear any existing timeout
  //       if (timeoutIdRef.current) {
  //         clearTimeout(timeoutIdRef.current);
  //       }
  //       timeoutIdRef.current = setTimeout(() => {
  //         setShowRedX(false);
  //       }, 3000);
  //     }

  //     setUserAnswer('');
  //   } catch (error) {
  //     console.error('Error submitting guess:', error);
  //     setFeedbackMessage('An error occurred while submitting your guess.');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) return;
    setFeedbackMessage('');

    const trimmedAnswer = userAnswer.trim();
    if (trimmedAnswer === '') {
      setFeedbackMessage('Please enter a valid answer.');
      return;
    }

    // Initialize Fuse.js for fuzzy matching
    const fuse = new Fuse(selectedQuestion.answers, {
      keys: ['text'],
      threshold: 0.3, // Adjust this to determine how fuzzy you want the match to be
    });

    // Find the best match for the user's input
    const result = fuse.search(trimmedAnswer);
    const bestMatch = result.length > 0 ? result[0].item.text : null;

    // Check if the best match is acceptable
    if (bestMatch) {
      const isCorrect = true;

      // Check if the user has already guessed this answer
      const existingGuess = user.Guesses.find(
        (guess) =>
          guess.questionId === selectedQuestion.id &&
          guess.guess.toLowerCase() === bestMatch.toLowerCase()
      );

      if (existingGuess) {
        setFeedbackMessage('You have already guessed this answer.');
        return;
      }

      try {
        // Dispatch createGuess and wait for the created guess
        await dispatch(
          createGuess({
            guess: bestMatch, // Use the matched answer
            userId: userId,
            questionId: selectedQuestion.id,
          })
        );

        // Re-fetch the user's data to update guesses
        await dispatch(fetchSingleUser(userId));

        setUserAnswer('');
      } catch (error) {
        console.error('Error submitting guess:', error);
        setFeedbackMessage('An error occurred while submitting your guess.');
      }
    } else {
      setShowRedX(true);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = setTimeout(() => {
        setShowRedX(false);
      }, 3000);
      setUserAnswer('');
      setFeedbackMessage('Incorrect answer. Try again.');
    }
  };

  return (
    <div className="qotd-container">
      {showRedX && (
        <div className="red-x-overlay">
          <div className="red-x">X</div>
        </div>
      )}
      {selectedQuestion ? (
        <>
          <div className="qotd-question-section">
            {/* <h2 className="qotd-heading">Top 10</h2>
            <p className="qotd-date">
              <i className="fas fa-calendar-alt" style={{ marginRight: '10px' }}></i>
              {(() => {
                const [year, month, day] = selectedQuestion.dateAsked
                  .split('-')
                  .map(Number);
                const localDate = new Date(year, month - 1, day);
                return localDate.toLocaleDateString();
              })()}
            </p> */}
            <p className="qotd-text">{selectedQuestion.text}</p>

            {/* Display Ranked Answers */}
            <div className="qotd-ranked-answers">
              {/* <h3>Ranked Answers</h3> */}
              <div className="ranked-answers-list">
                {rankedAnswers.map((answerObj, index) => (
                  <div key={index} className="ranked-answer-item">
                    <span className="rank-number">{index + 1}.</span>
                    <div
                      className={`rank-answer-bubble ${
                        answerObj.guessed
                          ? 'guessed'
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
//               <form onSubmit={handleSubmit} className="qotd-answer-form">
//   <label htmlFor="userAnswer">Enter your answer:</label>
//   <div className="input-group">
//     <input
//       type="text"
//       id="userAnswer"
//       list="answerSuggestions" // Link input to datalist
//       value={userAnswer}
//       onChange={(e) => setUserAnswer(e.target.value)}
//       required
//       className="qotd-answer-input"
//       placeholder="Type your answer here..."
//     />
//     <datalist id="answerSuggestions">
//       {selectedQuestion &&
//         selectedQuestion.answers.map((answer, index) => (
//           <option key={index} value={answer.text} />
//         ))}
//     </datalist>
//     <button type="submit" className="qotd-submit-button">
//       Submit
//     </button>
//   </div>
// </form>
            ) : allAnswersGuessed ? (
              <p className="congrats-message">Congrats! You got all the answers!</p>
            ) : null}

            {/* Feedback Message */}
               {/* Display User Score */}
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
                  You have reached the maximum number of strikes. All answers are revealed.
                </p>
              )}
            </div>
            {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
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




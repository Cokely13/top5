// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestions } from '../store/allQuestionsStore';
// import { fetchSingleUser } from '../store/singleUserStore';
// import { createGuess } from '../store/allGuessesStore';

// function QuestionOfTheDay() {
//   const dispatch = useDispatch();

//   // Selectors
//   const questions = useSelector((state) => state.allQuestions || []);
//   const { id: userId } = useSelector((state) => state.auth);
//   const user = useSelector((state) => state.singleUser);

//   // Local State
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [userAnswer, setUserAnswer] = useState('');
//   const [fullAnswers, setFullAnswers] = useState(Array(10).fill('__________'));
//   const [rankedAnswers, setRankedAnswers] = useState(Array(10).fill('__________'));
//   const [strikes, setStrikes] = useState(0);
//   const maxStrikes = 3;
//   const [feedbackMessage, setFeedbackMessage] = useState('');
//   const [allAnswersGuessed, setAllAnswersGuessed] = useState(false);
//   const [userScore, setUserScore] = useState(0); // New state variable

//   // Fetch data on mount
//   useEffect(() => {
//     dispatch(fetchQuestions());
//     if (userId) {
//       dispatch(fetchSingleUser(userId));
//     }
//   }, [dispatch, userId]);

//   // Set selected question
//   useEffect(() => {
//     if (questions.length > 0) {
//       const todayDate = new Date().toISOString().split('T')[0];
//       const todayQuestion =
//         questions.find((q) => q.dateAsked === todayDate) || questions[0];
//       setSelectedQuestion(todayQuestion);
//     }
//   }, [questions]);

//   // Set full answers
//   useEffect(() => {
//     if (selectedQuestion && selectedQuestion.answers) {
//       const answersArray = Array(10).fill('__________');
//       selectedQuestion.answers.forEach((answer) => {
//         answersArray[answer.rank - 1] = answer.text;
//       });
//       setFullAnswers(answersArray);
//     }
//   }, [selectedQuestion]);

//   // Reconstruct rankedAnswers, strikes, and userScore
//   useEffect(() => {
//     if (selectedQuestion && user && user.Guesses && selectedQuestion.answers) {
//       const userGuesses = user.Guesses.filter(
//         (guess) => guess.questionId === selectedQuestion.id
//       );

//       const newRankedAnswers = Array(10).fill('__________');
//       let newStrikes = 0;
//       let totalPoints = 0;

//       userGuesses.forEach((guess) => {
//         const matchedAnswer = selectedQuestion.answers.find(
//           (ans) => ans.text.toLowerCase() === guess.guess.toLowerCase()
//         );

//         if (matchedAnswer) {
//           const rankIndex = matchedAnswer.rank - 1;
//           newRankedAnswers[rankIndex] = matchedAnswer.text;

//           // Add points earned for this correct guess
//           totalPoints += guess.pointsEarned || 0;
//         } else {
//           newStrikes += 1;
//         }
//       });

//       setRankedAnswers(newRankedAnswers);
//       setStrikes(newStrikes);
//       setUserScore(totalPoints); // Update userScore

//       if (newStrikes >= maxStrikes) {
//         setRankedAnswers(fullAnswers);
//       }

//       // Check if all answers have been guessed
//       const allGuessed = newRankedAnswers.every((answer) => answer !== '__________');
//       setAllAnswersGuessed(allGuessed);
//     }
//   }, [user, selectedQuestion, fullAnswers]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedQuestion) return;
//     setFeedbackMessage('');

//     const trimmedAnswer = userAnswer.trim();
//     if (trimmedAnswer === '') {
//       setFeedbackMessage('Please enter a valid answer.');
//       return;
//     }

//     // Check if the user has already guessed this answer
//     const existingGuess = user.Guesses.find(
//       (guess) =>
//         guess.questionId === selectedQuestion.id &&
//         guess.guess.toLowerCase() === trimmedAnswer.toLowerCase()
//     );

//     if (existingGuess) {
//       setFeedbackMessage('You have already guessed this answer.');
//       return;
//     }

//     try {
//       // Dispatch createGuess and wait for the created guess
//       await dispatch(
//         createGuess({
//           guess: trimmedAnswer,
//           userId: userId,
//           questionId: selectedQuestion.id,
//         })
//       );

//       // Re-fetch the user's data to update guesses
//       await dispatch(fetchSingleUser(userId));

//       setUserAnswer('');
//     } catch (error) {
//       console.error('Error submitting guess:', error);
//       setFeedbackMessage('An error occurred while submitting your guess.');
//     }
//   };

//   console.log("selec", selectedQuestion)



//   return (
//     <div className="qotd-container">
//       {selectedQuestion ? (
//         <>
//           <div className="qotd-question-section">
//             <h2 className="qotd-heading">Top 10</h2>
//             {/* <p className="qotd-date">
//               {new Date(selectedQuestion.dateAsked).toLocaleDateString()}
//             </p> */}
//             <p className="qotd-date">
//   {new Date(...selectedQuestion.dateAsked.split('-').map((v, i) => v - (i === 1))).toLocaleDateString()}
// </p>
//             <p className="qotd-text">{selectedQuestion.text}</p>

//             {/* Display Ranked Answers */}
//             <div className="qotd-ranked-answers">
//               <h3>Ranked Answers:</h3>
//               <div className="ranked-answers-list">
//                 {rankedAnswers.map((answer, index) => (
//                   <div key={index} className="ranked-answer-item">
//                     <span className="rank-number">{index + 1}.</span>
//                     <span className="rank-answer">{answer}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Display User Score */}
//             <div className="qotd-user-score">
//               <p>Your Score: {userScore}</p>
//             </div>

//             {/* Display Strikes */}
//             <div className="qotd-strikes">
//               <p>
//                 Strikes: {strikes} / {maxStrikes}
//               </p>
//               {strikes >= maxStrikes && (
//                 <p className="strike-warning">
//                   You have reached the maximum number of strikes. All answers are revealed.
//                 </p>
//               )}
//             </div>

//             {/* Answer Input */}
//             {!allAnswersGuessed && strikes < maxStrikes ? (
//               <form onSubmit={handleSubmit} className="qotd-answer-form">
//                 <label htmlFor="userAnswer">Enter your answer:</label>
//                 <input
//                   type="text"
//                   id="userAnswer"
//                   value={userAnswer}
//                   onChange={(e) => setUserAnswer(e.target.value)}
//                   required
//                   className="qotd-answer-input"
//                   placeholder="Type your answer here..."
//                 />
//                 <button type="submit" className="qotd-submit-button">
//                   Submit
//                 </button>
//               </form>
//             ) : allAnswersGuessed ? (
//               <p className="congrats-message">Congrats! You Got All the Answers!</p>
//             ) : null}

//             {/* Feedback Message */}
//             {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
//           </div>
//         </>
//       ) : (
//         <div className="qotd-no-question">
//           {questions.length > 0 ? 'No question for today.' : 'Loading questions...'}
//         </div>
//       )}
//     </div>
//   );
// }

// export default QuestionOfTheDay;

// components/QuestionOfTheDay.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchSingleUser } from '../store/singleUserStore';
import { createGuess } from '../store/allGuessesStore';
// import './QuestionOfTheDay.css'; // Import the CSS file

function QuestionOfTheDay() {
  const dispatch = useDispatch();

  // Selectors
  const questions = useSelector((state) => state.allQuestions || []);
  const { id: userId } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.singleUser);

  // Local State
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [fullAnswers, setFullAnswers] = useState(Array(10).fill('__________'));
  const [rankedAnswers, setRankedAnswers] = useState(Array(10).fill('__________'));
  const [strikes, setStrikes] = useState(0);
  const maxStrikes = 3;
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [allAnswersGuessed, setAllAnswersGuessed] = useState(false);
  const [userScore, setUserScore] = useState(0);

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

  // Set full answers
  useEffect(() => {
    if (selectedQuestion && selectedQuestion.answers) {
      const answersArray = Array(10).fill('__________');
      selectedQuestion.answers.forEach((answer) => {
        answersArray[answer.rank - 1] = answer.text;
      });
      setFullAnswers(answersArray);
    }
  }, [selectedQuestion]);

  // Reconstruct rankedAnswers, strikes, and userScore
  useEffect(() => {
    if (selectedQuestion && user && user.Guesses && selectedQuestion.answers) {
      const userGuesses = user.Guesses.filter(
        (guess) => guess.questionId === selectedQuestion.id
      );

      const newRankedAnswers = Array(10).fill('__________');
      let newStrikes = 0;
      let totalPoints = 0;

      userGuesses.forEach((guess) => {
        const matchedAnswer = selectedQuestion.answers.find(
          (ans) => ans.text.toLowerCase() === guess.guess.toLowerCase()
        );

        if (matchedAnswer) {
          const rankIndex = matchedAnswer.rank - 1;
          newRankedAnswers[rankIndex] = matchedAnswer.text;

          // Add points earned for this correct guess
          totalPoints += guess.pointsEarned || 0;
        } else {
          newStrikes += 1;
        }
      });

      setRankedAnswers(newRankedAnswers);
      setStrikes(newStrikes);
      setUserScore(totalPoints);

      if (newStrikes >= maxStrikes) {
        setRankedAnswers(fullAnswers);
      }

      // Check if all answers have been guessed
      const allGuessed = newRankedAnswers.every((answer) => answer !== '__________');
      setAllAnswersGuessed(allGuessed);
    }
  }, [user, selectedQuestion, fullAnswers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) return;
    setFeedbackMessage('');

    const trimmedAnswer = userAnswer.trim();
    if (trimmedAnswer === '') {
      setFeedbackMessage('Please enter a valid answer.');
      return;
    }

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
      await dispatch(fetchSingleUser(userId));

      setUserAnswer('');
    } catch (error) {
      console.error('Error submitting guess:', error);
      setFeedbackMessage('An error occurred while submitting your guess.');
    }
  };

  return (
    <div className="qotd-container">
      {selectedQuestion ? (
        <>
          <div className="qotd-question-section">
            <h2 className="qotd-heading">Top 10</h2>
            <p className="qotd-date">
              {(() => {
                const [year, month, day] = selectedQuestion.dateAsked
                  .split('-')
                  .map(Number);
                const localDate = new Date(year, month - 1, day);
                return localDate.toLocaleDateString();
              })()}
            </p>
            <p className="qotd-text">{selectedQuestion.text}</p>

            {/* Display Ranked Answers */}
            <div className="qotd-ranked-answers">
              <h3>Ranked Answers</h3>
              <div className="ranked-answers-list">
                {rankedAnswers.map((answer, index) => (
                  <div key={index} className="ranked-answer-item">
                    <span className="rank-number">{index + 1}.</span>
                    <span className="rank-answer">{answer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Display User Score */}
            <div className="qotd-user-score">
              <p>Your Score: <strong>{userScore}</strong></p>
            </div>

            {/* Display Strikes */}
            <div className="qotd-strikes">
              <p>
                Strikes: <strong>{strikes} / {maxStrikes}</strong>
              </p>
              {strikes >= maxStrikes && (
                <p className="strike-warning">
                  You have reached the maximum number of strikes. All answers are revealed.
                </p>
              )}
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

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestions } from '../store/allQuestionsStore';
// import { fetchUsers } from '../store/allUsersStore';
// import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';


// function QuestionOfTheDay() {
//   const dispatch = useDispatch();
//   const questions = useSelector((state) => state.allQuestions || []);
//   const users = useSelector((state) => state.allUsers || []);
//   const { id: userId } = useSelector((state) => state.auth);
//   const user = useSelector((state) => state.singleUser);
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [yesterdayQuestion, setYesterdayQuestion] = useState(null);
//   const [hasVoted, setHasVoted] = useState(false);
//   const [todaysVote, setTodaysVote] = useState('');
//   const [timeLeft, setTimeLeft] = useState('');
//   const [yesterdayConsensus, setYesterdayConsensus] = useState('');
//   const [yesterdayResult, setYesterdayResult] = useState('');
//   const [streak, setStreak] = useState({ correct: 0, incorrect: 0, noVote: 0 });
//   const [careerHigh, setCareerHigh] = useState({
//     winStreak: 0,
//     lossStreak: 0,
//     noVoteStreak: 0,
//   });

//   useEffect(() => {
//     dispatch(fetchQuestions());
//     dispatch(fetchUsers());
//     if (userId) {
//       dispatch(fetchSingleUser(userId));
//     }
//   }, [dispatch, userId]);







//   return (
//     <div className="qotd-container">
//       {selectedQuestion ? (
//         <div className="qotd-question-section">
//           <h2 className="qotd-heading">Question of the Day</h2>
//           <p className="qotd-date">{new Date().toLocaleDateString()}</p>
//           <h3 className="qotd-timer">
//             {hasVoted
//               ? 'Time Until the Next Question:'
//               : 'Time Left to Answer the Question:'}{' '}
//             {timeLeft}
//           </h3>
//           {!hasVoted ? (
//             <div className="qotd-options-container">
//               <div className="qotd-option">
//                 <img
//                   src={selectedQuestion.imageA}
//                   alt={selectedQuestion.optionA}
//                   className="qotd-option-image"
//                 />
//                 <button
//                   onClick={() => handleVote('optionA')}
//                   className="qotd-vote-button"
//                 >
//                   {selectedQuestion.optionA}
//                 </button>
//               </div>
//               <div className="qotd-option">
//                 <img
//                   src={selectedQuestion.imageB}
//                   alt={selectedQuestion.optionB}
//                   className="qotd-option-image"
//                 />
//                 <button
//                   onClick={() => handleVote('optionB')}
//                   className="qotd-vote-button"
//                 >
//                   {selectedQuestion.optionB}
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="qotd-already-voted">
//               <p>Your Vote:</p>
//               {todaysVote === 'option_a' ? (
//                 <div>
//                   <img
//                     src={selectedQuestion.imageA}
//                     alt={selectedQuestion.optionA}
//                     className="qotd-option-image"
//                   />
//                   <p>{selectedQuestion.optionA}</p>
//                 </div>
//               ) : (
//                 <div>
//                   <img
//                     src={selectedQuestion.imageB}
//                     alt={selectedQuestion.optionB}
//                     className="qotd-option-image"
//                   />
//                   <p>{selectedQuestion.optionB}</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="qotd-no-question">
//           {questions.length > 0 ? 'No question for today.' : 'Loading questions...'}
//         </div>
//       )}
//     </div>
//   );
// }

// export default QuestionOfTheDay;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchUsers } from '../store/allUsersStore';
import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';

function QuestionOfTheDay() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.allQuestions || []);
  const users = useSelector((state) => state.allUsers || []);
  const { id: userId } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.singleUser);

  // State variables
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [rankedAnswers, setRankedAnswers] = useState(Array(10).fill('')); // 10 blank slots
  const [strikes, setStrikes] = useState(0);
  const maxStrikes = 3; // Define maximum strikes allowed

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchUsers());
    if (userId) {
      dispatch(fetchSingleUser(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (questions.length > 0) {
      // Assuming the first question is today's question
      setSelectedQuestion(questions[0]);
    }
  }, [questions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    // Find the answer ignoring case
    const matchedAnswer = selectedQuestion.answers.find(
      (ans) => ans.text.toLowerCase() === userAnswer.trim().toLowerCase()
    );

    if (matchedAnswer) {
      const rankIndex = matchedAnswer.rank - 1; // Array index starts at 0
      if (rankedAnswers[rankIndex] === '') {
        const updatedRankedAnswers = [...rankedAnswers];
        updatedRankedAnswers[rankIndex] = matchedAnswer.text;
        setRankedAnswers(updatedRankedAnswers);
        setUserAnswer('');
      } else {
        alert(`Rank ${matchedAnswer.rank} is already filled with "${matchedAnswer.text}".`);
      }
    } else {
      setStrikes(strikes + 1);
      alert('Incorrect answer. You have a strike.');
    }
  };

  return (
    <div className="qotd-container">
      {selectedQuestion ? (
        <div className="qotd-question-section">
          <h2 className="qotd-heading">Question of the Day</h2>
          <p className="qotd-date">{new Date().toLocaleDateString()}</p>
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
            {strikes >= maxStrikes && <p className="strike-warning">You have reached the maximum number of strikes.</p>}
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

        </div>
      ) : (
        <div className="qotd-no-question">
          {questions.length > 0 ? 'No question for today.' : 'Loading questions...'}
        </div>
      )}
    </div>
  );
}

export default QuestionOfTheDay;

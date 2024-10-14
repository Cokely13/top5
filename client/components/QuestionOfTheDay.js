import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchUsers } from '../store/allUsersStore';
import { fetchSingleUser } from '../store/singleUserStore';
import { fetchGuesses, createGuess } from '../store/allGuessesStore';

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
  const [createdGuess, setCreatedGuess] = useState([]);
  const [rankedAnswers, setRankedAnswers] = useState(Array(10).fill('')); // 10 blank slots
  const [strikes, setStrikes] = useState(0);
  const maxStrikes = 3; // Define maximum strikes allowed
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Fetch all necessary data on component mount
  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchUsers());
    if (userId) {
      dispatch(fetchSingleUser(userId));
    }
  }, [dispatch, userId]);

  // Set the selected question and fetch guesses for that question
  useEffect(() => {
    if (questions.length > 0) {
      // Select today's question based on dateAsked
      const todayDate = new Date().toISOString().split('T')[0];
      const todayQuestion = questions.find(
        (q) => q.dateAsked === todayDate
      ) || questions[0]; // Fallback to the first question
      setSelectedQuestion(todayQuestion);

      // Fetch all guesses for the question
      if (todayQuestion) {
        dispatch(fetchGuesses());
      }
    }
  }, [questions, dispatch]);

  useEffect(() => {
    if (selectedQuestion && user && user.guesses) {
      // Initialize rankedAnswers array with blank spaces.
      const newRankedAnswers = Array(10).fill('__________');
      console.log("user", user)
      // If the user has 3 or more strikes, reveal all answers.
      if (strikes >= 3) {
        selectedQuestion.answers.forEach((answer) => {
          newRankedAnswers[answer.rank - 1] = answer.text;
        });
      } else {
        // Set correct guesses into their appropriate rank slots.
        user.guesses
          .filter((guess) => guess.questionId === selectedQuestion.id && guess.rank !== null)
          .forEach((guess) => {
            newRankedAnswers[guess.rank - 1] = guess.guess;
          });
      }

      setRankedAnswers(newRankedAnswers);
    }
  }, [selectedQuestion, user, strikes]);

  // Update ranked answers and strikes based on user guesses
  useEffect(() => {
    if (selectedQuestion && user && user.guesses && selectedQuestion.answers) {
      // Filter guesses for the current question

      console.log("user!!!", user)
      const userGuesses = user.guesses.filter(
        (guess) => guess.questionId === selectedQuestion.id
      );

      // Initialize rankedAnswers and strikes
      const newRankedAnswers = Array(10).fill('');
      let newStrikes = 0;

      userGuesses.forEach((guess) => {
        // Check if the guess is correct
        const matchedAnswer = selectedQuestion.answers.find(
          (ans) => ans.text.toLowerCase() === guess.guess.toLowerCase()
        );

        if (matchedAnswer) {
          // Place the correct answer in the ranked position
          const rankIndex = matchedAnswer.rank - 1;
          newRankedAnswers[rankIndex] = matchedAnswer.text;
        } else {
          // If incorrect, accumulate strikes
          newStrikes += 1;
        }
      });

      setRankedAnswers(newRankedAnswers);
      setStrikes(newStrikes);
    }
  }, [user, selectedQuestion]);

  // Handle submitting a new guess
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!selectedQuestion) return;

  //   console.log("user", userAnswer)

  //   const trimmedAnswer = userAnswer.trim().toLowerCase();
  //   if (trimmedAnswer === '') {
  //     setFeedbackMessage('Please enter a valid answer.');
  //     return;
  //   }

  //   try {
  //     // Dispatch createGuess and wait for the created guess
  //     const createdGuess = await dispatch(
  //       createGuess({
  //         guess: trimmedAnswer,
  //         userId: userId,
  //         questionId: selectedQuestion.id,
  //       })
  //     );

  //     console.log("selected", selectedQuestion)

  //     if (createdGuess) {

  //       console.log("Created!!")
  //       const matchedAnswer = selectedQuestion.answers.text.find(
  //         (ans) => ans.text.toLowerCase() === createdGuess.guess.toLowerCase()
  //       );



  //       if (matchedAnswer) {
  //         // Correct guess, update feedback and ranked answers.
  //         // setFeedbackMessage(`Correct! You earned ${createdGuess.pointsEarned} points.`);
  //         console.log("got one!",matchedAnswer )
  //       } else {
  //         console.log("NOPE!!")
  //         // Incorrect guess, increment strikes.
  //         setStrikes((prevStrikes) => {
  //           const updatedStrikes = prevStrikes + 1;
  //           if (updatedStrikes >= maxStrikes) {
  //             setFeedbackMessage('You have reached the maximum number of strikes. All answers are revealed.');
  //           } else {
  //             setFeedbackMessage(`Incorrect. You have ${updatedStrikes} strike(s).`);
  //           }
  //           return updatedStrikes;
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error submitting guess:', error);
  //     setFeedbackMessage('An error occurred while submitting your guess.');
  //   }

  //   setUserAnswer('');
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    console.log("user", userAnswer);

    const trimmedAnswer = userAnswer.trim().toLowerCase();
    if (trimmedAnswer === '') {
      setFeedbackMessage('Please enter a valid answer.');
      return;
    }


    try {
      // Dispatch createGuess and wait for the created guess
      const createdGuess ={guess: trimmedAnswer,
          guess: trimmedAnswer,
          userId: userId,
          questionId: selectedQuestion.id}


      console.log("selected", selectedQuestion);

      // Log the response to see what exactly is returned




      if (createdGuess) {
        console.log("Created!!");

        // Correctly find the matched answer from selectedQuestion.answers
        const matchedAnswer = selectedQuestion.answers.find(
          (ans) => ans.text.toLowerCase() === createdGuess.guess.toLowerCase()
        );

        if (matchedAnswer) {
          // Correct guess, update feedback and ranked answers.
          console.log("got one!", matchedAnswer);
          setFeedbackMessage(`Correct! You earned ${createdGuess.pointsEarned} points.`);

          // Update ranked answers with the correct answer
          const rankIndex = matchedAnswer.rank - 1;
          setRankedAnswers((prev) => {
            const updated = [...prev];
            updated[rankIndex] = matchedAnswer.text;
            return updated;
          });
        } else {
          console.log("NOPE!!");
          // Incorrect guess, increment strikes.
          setStrikes((prevStrikes) => {
            const updatedStrikes = prevStrikes + 1;
            if (updatedStrikes >= maxStrikes) {
              setFeedbackMessage('You have reached the maximum number of strikes. All answers are revealed.');
            } else {
              setFeedbackMessage(`Incorrect. You have ${updatedStrikes} strike(s).`);
            }
            return updatedStrikes;
          });
        }
      } else {
        console.error('No created guess found.');
      }
    } catch (error) {
      console.error('Error submitting guess:', error);
      setFeedbackMessage('An error occurred while submitting your guess.');
    }

    const createdGuessResponse = await dispatch(
      createGuess({
        guess: trimmedAnswer,
        userId: userId,
        questionId: selectedQuestion.id,
      })
    );

    setUserAnswer('');
  };




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
        <span className="rank-answer">{answer}</span>
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

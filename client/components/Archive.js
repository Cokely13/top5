import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchSingleUser } from '../store/singleUserStore';

function Archive() {
  const dispatch = useDispatch();

  // Selectors
  const questions = useSelector((state) => state.allQuestions || []);
  const { id: userId } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.singleUser);

  // Local State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [rankedAnswers, setRankedAnswers] = useState(
    Array.from({ length: 10 }, () => ({ text: '__________', guessed: false, revealed: false }))
  );

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchQuestions());
    if (userId) {
      dispatch(fetchSingleUser(userId));
    }
  }, [dispatch, userId]);

  // Update selected question when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const question = questions.find((q) => q.dateAsked === selectedDate);
      setSelectedQuestion(question || null);
    }
  }, [selectedDate, questions]);

  // Reconstruct rankedAnswers when selectedQuestion changes
  useEffect(() => {
    if (selectedQuestion && user && user.Guesses && selectedQuestion.answers) {
      const userGuesses = user.Guesses.filter(
        (guess) => guess.questionId === selectedQuestion.id
      );

      const newRankedAnswers = Array.from({ length: 10 }, () => ({ text: '__________', guessed: false, revealed: false }));

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
        }
      });

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

      setRankedAnswers(newRankedAnswers);
    }
  }, [user, selectedQuestion]);

  const oldQuestions = questions.filter((question) => question.expired == true)


  // Generate options for the date dropdown
  const dateOptions = oldQuestions.map((question) => ({
    dateAsked: question.dateAsked,
    formattedDate: new Date(question.dateAsked).toLocaleDateString(),
  }));

  // Remove duplicate dates if there are multiple questions on the same date
  const uniqueDateOptions = Array.from(new Set(dateOptions.map((item) => item.dateAsked))).map((date) => {
    const formattedDate = new Date(date).toLocaleDateString();
    return { dateAsked: date, formattedDate };
  });

  // Sort the dates in descending order
  uniqueDateOptions.sort((a, b) => new Date(b.dateAsked) - new Date(a.dateAsked));

  return (
    <div className="archive-container">
      <h2 className="archive-heading">Question Archive</h2>

      {/* Date Selection Dropdown */}
      <div className="date-selection">
        <label htmlFor="date-select">Select Date: </label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="" disabled>
            -- Select a Date --
          </option>
          {uniqueDateOptions.map((option) => (
            <option key={option.dateAsked} value={option.dateAsked}>
              {option.formattedDate}
            </option>
          ))}
        </select>
      </div>

      {/* Display Selected Question and Answers */}
      {selectedQuestion ? (
        <div className="selected-question-section">
          <h3 className="selected-question-text">{selectedQuestion.text}</h3>
          <div className="ranked-answers-list">
            {rankedAnswers.map((answerObj, index) => (
              <div key={index} className="ranked-answer-item">
                <span className="rank-number">{index + 1}.</span>
                <div
                  className={`rank-answer-bubble ${
                    answerObj.guessed ? 'guessed' : answerObj.revealed ? 'revealed' : 'empty'
                  }`}
                >
                  {answerObj.text !== '__________' ? answerObj.text : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-question-selected">
          <p>Please select a date to view the question and answers.</p>
        </div>
      )}
    </div>
  );
}

export default Archive;

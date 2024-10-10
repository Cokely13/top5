import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { createConsensus } from '../store/allConsensusesStore';
import { updateSingleQuestion } from '../store/singleQuestionStore';

function Archive() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.allQuestions);
  const user = useSelector((state) => state.auth);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const calculateVotes = (userResponses, option) => {
    return userResponses.filter((response) => response.response === option).length;
  };

  const handleCreateConsensus = async (question) => {
    const optionAVotes = calculateVotes(question.user_responses, 'option_a');
    const optionBVotes = calculateVotes(question.user_responses, 'option_b');

    if (optionAVotes === optionBVotes) {
      alert('Cannot Do, No Consensus');
      return;
    }

    const consensusAnswer = optionAVotes > optionBVotes ? 'option_a' : 'option_b';

    await dispatch(
      createConsensus({
        questionId: question.id,
        consensusAnswer,
        calculatedAt: new Date().toISOString(),
      })
    );

    dispatch(fetchQuestions());
  };

  const handleReopenQuestion = async (question) => {
    await dispatch(updateSingleQuestion(question.id, { expired: false }));
    dispatch(fetchQuestions());
  };


  const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0); // Set time to midnight

  const filteredQuestions = questions.filter((question) => {
    const questionDate = new Date(question.dateAsked);
    return questionDate < yesterday && question.status === 'accepted';
  });



  return (
    <div className="archive-page-container">
      <h2 className="archive-page-heading">Archive</h2>
      {filteredQuestions.length > 0 ? (
        isMobile ? (
          // Mobile layout: Card view
          filteredQuestions.map((question) => {
            const optionAVotes = calculateVotes(question.user_responses, 'option_a');
            const optionBVotes = calculateVotes(question.user_responses, 'option_b');

            const highlightOptionA = optionAVotes > optionBVotes ? 'highlight-option-a' : '';
            const highlightOptionB = optionBVotes > optionAVotes ? 'highlight-option-b' : '';

            const isExpired = question.consensus.length ? true : false;

            return (
              <div className="archive-card" key={question.id}>
                <div className="archive-card-row">
                  <span className="archive-card-label">Question:</span>
                  <span>{question.text}</span>
                </div>
                <div className={`archive-card-row ${highlightOptionA}`}>
                  <span className="archive-card-label">Option A:</span>
                  <span>{question.optionA}</span>
                  <span className="archive-card-label">Votes:</span>
                  <span>{optionAVotes}</span>
                </div>
                <div className={`archive-card-row ${highlightOptionB}`}>
                  <span className="archive-card-label">Option B:</span>
                  <span>{question.optionB}</span>
                  <span className="archive-card-label">Votes:</span>
                  <span>{optionBVotes}</span>
                </div>
                <div className="archive-card-row">
                  <span className="archive-card-label">Date Asked:</span>
                  <span>{new Date(question.dateAsked).toLocaleDateString()}</span>
                </div>
                {user.admin && (
                  <div className="archive-card-row">
                    {isExpired ? (
                      <button
                        className="reopen-button"
                        onClick={() => handleReopenQuestion(question)}
                      >
                        Reopen the Question
                      </button>
                    ) : (
                      <button
                        className="archive-button"
                        onClick={() => handleCreateConsensus(question)}
                      >
                        Create Consensus
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // Desktop layout: Grid view
          <div className="archive-grid-container">
            {/* Header Row */}
            <div className="archive-grid-header">Question</div>
            <div className="archive-grid-header">Option A</div>
            <div className="archive-grid-header">Votes for Option A</div>
            <div className="archive-grid-header">Option B</div>
            <div className="archive-grid-header">Votes for Option B</div>
            <div className="archive-grid-header">Date Asked</div>
            <div className="archive-grid-header">Action</div>

            {/* Data Rows */}
            {filteredQuestions.map((question) => {
              const optionAVotes = calculateVotes(question.user_responses, 'option_a');
              const optionBVotes = calculateVotes(question.user_responses, 'option_b');

              const highlightOptionA = optionAVotes > optionBVotes ? 'highlight-option-a' : '';
              const highlightOptionB = optionBVotes > optionAVotes ? 'highlight-option-b' : '';

              const isExpired = question.consensus.length ? true : false;

              return (
                <React.Fragment key={question.id}>
                  <div className="archive-grid-cell">{question.text}</div>
                  <div className={`archive-grid-cell ${highlightOptionA}`}>
                    {question.optionA}
                  </div>
                  <div className="archive-grid-cell">{optionAVotes}</div>
                  <div className={`archive-grid-cell ${highlightOptionB}`}>
                    {question.optionB}
                  </div>
                  <div className="archive-grid-cell">{optionBVotes}</div>
                  <div className="archive-grid-cell">
                    {new Date(question.dateAsked).toLocaleDateString()}
                  </div>
                  <div className="archive-grid-cell">
                    {user.admin ? (
                      isExpired ? (
                        <button
                          className="reopen-button"
                          onClick={() => handleReopenQuestion(question)}
                        >
                          Reopen the Question
                        </button>
                      ) : (
                        <button
                          className="archive-button"
                          onClick={() => handleCreateConsensus(question)}
                        >
                          Create Consensus
                        </button>
                      )
                    ) : null}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )
      ) : (
        <p className="no-questions-message">No archived questions found.</p>
      )}
    </div>
  );
}

export default Archive;

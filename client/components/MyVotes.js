// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestions } from '../store/allQuestionsStore';
// import { fetchSingleUser } from '../store/singleUserStore';

// function MyVotes() {
//   const dispatch = useDispatch();
//   const questions = useSelector((state) => state.allQuestions);
//   const { id: userId } = useSelector((state) => state.auth);
//   const user = useSelector((state) => state.singleUser);
//   const [filteredQuestions, setFilteredQuestions] = useState([]);

//   useEffect(() => {
//     dispatch(fetchQuestions());
//     dispatch(fetchSingleUser(userId));
//   }, [dispatch, userId]);

//   useEffect(() => {
//     // Filter questions with dates today or in the past and status "accepted"
//     const today = new Date().toISOString().split('T')[0];
//     const filtered = questions.filter(
//       (question) => question.status === 'accepted' && question.dateAsked <= today
//     );

//     // Sort questions by dateAsked in descending order (newest first)
//     const sorted = [...filtered].sort(
//       (a, b) => new Date(b.dateAsked) - new Date(a.dateAsked)
//     );

//     setFilteredQuestions(sorted);
//   }, [questions]);

//   // Helper function to determine user's vote and return the corresponding image
//   const getUserVote = (question) => {
//     const userResponse = user.user_responses?.find(
//       (response) => response.questionId === question.id
//     );

//     if (!userResponse) return 'Did Not Vote';

//     if (userResponse.response === 'option_a') {
//       return (
//         <img
//           src={question.imageA}
//           alt="Your Vote - Option A"
//           className="my-votes-vote-image"
//         />
//       );
//     } else if (userResponse.response === 'option_b') {
//       return (
//         <img
//           src={question.imageB}
//           alt="Your Vote - Option B"
//           className="my-votes-vote-image"
//         />
//       );
//     }
//   };

//   return (
//     <div className="myvotes-container">
//       <h2 className="myvotes-heading">My Votes</h2>
//       {filteredQuestions.length > 0 ? (
//         <div className="myvotes-grid">
//           <div className="myvotes-grid-header">Question</div>
//           <div className="myvotes-grid-header">Option A</div>
//           <div className="myvotes-grid-header">Option B</div>
//           <div className="myvotes-grid-header">Date Asked</div>
//           <div className="myvotes-grid-header">Your Vote</div>

//           {filteredQuestions.map((question) => (
//             <React.Fragment key={question.id}>
//               <div className="myvotes-grid-cell">{question.text}</div>
//               <div className="myvotes-grid-cell">{question.optionA}</div>
//               <div className="myvotes-grid-cell">{question.optionB}</div>
//               <div className="myvotes-grid-cell">
//                 {new Date(question.dateAsked).toLocaleDateString()}
//               </div>
//               <div className="myvotes-grid-cell">{getUserVote(question)}</div>
//             </React.Fragment>
//           ))}
//         </div>
//       ) : (
//         <p className="myvotes-loading">Loading or No Votes Found...</p>
//       )}
//     </div>
//   );
// }

// export default MyVotes;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { fetchSingleUser } from '../store/singleUserStore';

function MyVotes() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.allQuestions);
  const { id: userId } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.singleUser);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchSingleUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const filtered = questions.filter(
      (question) => question.status === 'accepted' && question.dateAsked <= today
    );

    const sorted = [...filtered].sort(
      (a, b) => new Date(b.dateAsked) - new Date(a.dateAsked)
    );

    setFilteredQuestions(sorted);
  }, [questions]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const getUserVote = (question) => {
    const userResponse = user.user_responses?.find(
      (response) => response.questionId === question.id
    );

    if (!userResponse) return 'Did Not Vote';

    if (userResponse.response === 'option_a') {
      return (
        <img
          src={question.imageA}
          alt="Your Vote - Option A"
          className="my-votes-vote-image"
        />
      );
    } else if (userResponse.response === 'option_b') {
      return (
        <img
          src={question.imageB}
          alt="Your Vote - Option B"
          className="my-votes-vote-image"
        />
      );
    }
  };

  return (
    <div className="myvotes-container">
      <h2 className="myvotes-heading">My Votes</h2>
      {filteredQuestions.length > 0 ? (
        isMobile ? (
          // Mobile layout: Card view
          filteredQuestions.map((question) => (
            <div className="myvotes-card" key={question.id}>
              <div className="myvotes-card-row">
                <span className="myvotes-card-label">Question:</span>
                <span>{question.text}</span>
              </div>
              <div className="myvotes-card-row">
                <span className="myvotes-card-label">Option A:</span>
                <span>{question.optionA}</span>
              </div>
              <div className="myvotes-card-row">
                <span className="myvotes-card-label">Option B:</span>
                <span>{question.optionB}</span>
              </div>
              <div className="myvotes-card-row">
                <span className="myvotes-card-label">Date Asked:</span>
                <span>{new Date(question.dateAsked).toLocaleDateString()}</span>
              </div>
              <div className="myvotes-card-row">
                <span className="myvotes-card-label">Your Vote:</span>
                <span>{getUserVote(question)}</span>
              </div>
            </div>
          ))
        ) : (
          // Desktop layout: Grid view
          <div className="myvotes-grid">
            <div className="myvotes-grid-header">Question</div>
            <div className="myvotes-grid-header">Option A</div>
            <div className="myvotes-grid-header">Option B</div>
            <div className="myvotes-grid-header">Date Asked</div>
            <div className="myvotes-grid-header">Your Vote</div>

            {filteredQuestions.map((question) => (
              <React.Fragment key={question.id}>
                <div className="myvotes-grid-cell">{question.text}</div>
                <div className="myvotes-grid-cell">{question.optionA}</div>
                <div className="myvotes-grid-cell">{question.optionB}</div>
                <div className="myvotes-grid-cell">
                  {new Date(question.dateAsked).toLocaleDateString()}
                </div>
                <div className="myvotes-grid-cell">{getUserVote(question)}</div>
              </React.Fragment>
            ))}
          </div>
        )
      ) : (
        <p className="myvotes-loading">Loading or No Votes Found...</p>
      )}
    </div>
  );
}

export default MyVotes;

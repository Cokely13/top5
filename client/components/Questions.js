// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestions } from '../store/allQuestionsStore';
// import { Link } from 'react-router-dom';

// function Questions() {
//   const dispatch = useDispatch();
//   const questions = useSelector((state) => state.allQuestions);
//   const user = useSelector((state) => state.auth); // Get user information

//   useEffect(() => {
//     dispatch(fetchQuestions());
//   }, [dispatch]);

//   // Sort questions by dateAsked in descending order (newest first)
//   const sortedQuestions = [...questions].sort(
//     (a, b) => new Date(b.dateAsked) - new Date(a.dateAsked)
//   );

//   return (
//     <div className="questions-page-container">
//       <h2 className="questions-page-heading">Questions</h2>
//       <div className="questions-grid">
//         {/* Grid Headers */}
//         <div className="questions-grid-header">Question</div>
//         <div className="questions-grid-header">Option A</div>
//         <div className="questions-grid-header">Image A</div>
//         <div className="questions-grid-header">Option B</div>
//         <div className="questions-grid-header">Image B</div>
//         <div className="questions-grid-header">Date Asked</div>
//         <div className="questions-grid-header">Status</div>
//         {user.admin && <div className="questions-grid-header">Action</div>}

//         {/* Grid Rows */}
//         {sortedQuestions.map((question) => (
//           <React.Fragment key={question.id}>
//             <div className="questions-grid-cell">{question.text}</div>
//             <div className="questions-grid-cell">{question.optionA}</div>
//             <div className="questions-grid-cell">
//               {question.imageA && (
//                 <img
//                   src={question.imageA}
//                   alt="Option A"
//                   className="questions-image"
//                 />
//               )}
//             </div>
//             <div className="questions-grid-cell">{question.optionB}</div>
//             <div className="questions-grid-cell">
//               {question.imageB && (
//                 <img
//                   src={question.imageB}
//                   alt="Option B"
//                   className="questions-image"
//                 />
//               )}
//             </div>
//             <div className="questions-grid-cell">
//               {new Date(question.dateAsked).toLocaleDateString()}
//             </div>
//             <div className="questions-grid-cell">{question.status}</div>
//             {user.admin && (
//               <div className="questions-grid-cell">
//                 <Link to={`/edit-question/${question.id}`}>
//                   <button className="questions-edit-button">Edit Question</button>
//                 </Link>
//               </div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Questions;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/allQuestionsStore';
import { Link } from 'react-router-dom';

function Questions() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.allQuestions);
  const user = useSelector((state) => state.auth); // Get user information

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  // Sort questions by dateAsked in descending order (newest first)
  const sortedQuestions = [...questions].sort(
    (a, b) => new Date(b.dateAsked) - new Date(a.dateAsked)
  );

  return (
    <div className="questions-page-container">
      <h2 className="questions-page-heading">Questions</h2>

      {/* Grid View for Desktop */}
      <div className="questions-grid">
        {/* Grid Headers */}
        <div className="questions-grid-header">Question</div>
        <div className="questions-grid-header">Option A</div>
        <div className="questions-grid-header">Image A</div>
        <div className="questions-grid-header">Option B</div>
        <div className="questions-grid-header">Image B</div>
        <div className="questions-grid-header">Date Asked</div>
        <div className="questions-grid-header">Status</div>
        {user.admin && <div className="questions-grid-header">Action</div>}

        {/* Grid Rows */}
        {sortedQuestions.map((question) => (
          <React.Fragment key={question.id}>
            <div className="questions-grid-cell">{question.text}</div>
            <div className="questions-grid-cell">{question.optionA}</div>
            <div className="questions-grid-cell">
              {question.imageA && (
                <img
                  src={question.imageA}
                  alt="Option A"
                  className="questions-image"
                />
              )}
            </div>
            <div className="questions-grid-cell">{question.optionB}</div>
            <div className="questions-grid-cell">
              {question.imageB && (
                <img
                  src={question.imageB}
                  alt="Option B"
                  className="questions-image"
                />
              )}
            </div>
            <div className="questions-grid-cell">
              {new Date(question.dateAsked).toLocaleDateString()}
            </div>
            <div className="questions-grid-cell">{question.status}</div>
            {user.admin && (
              <div className="questions-grid-cell">
                <Link to={`/edit-question/${question.id}`}>
                  <button className="questions-edit-button">Edit Question</button>
                </Link>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Card View for Mobile */}
      <div className="questions-card-container">
        {sortedQuestions.map((question) => (
          <div className="questions-card" key={question.id}>
            <div className="questions-card-item">
              <span className="questions-card-label">Question:</span>
              {question.text}
            </div>
            <div className="questions-card-item">
              <span className="questions-card-label">Option A:</span>
              {question.optionA}
            </div>
            {question.imageA && (
              <div className="questions-card-item">
                <img
                  src={question.imageA}
                  alt="Option A"
                  className="questions-image"
                />
              </div>
            )}
            <div className="questions-card-item">
              <span className="questions-card-label">Option B:</span>
              {question.optionB}
            </div>
            {question.imageB && (
              <div className="questions-card-item">
                <img
                  src={question.imageB}
                  alt="Option B"
                  className="questions-image"
                />
              </div>
            )}
            <div className="questions-card-item">
              <span className="questions-card-label">Date Asked:</span>
              {new Date(question.dateAsked).toLocaleDateString()}
            </div>
            <div className="questions-card-item">
              <span className="questions-card-label">Status:</span>
              {question.status}
            </div>
            {user.admin && (
              <div className="questions-card-item">
                <Link to={`/edit-question/${question.id}`}>
                  <button className="questions-edit-button">Edit Question</button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Questions;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { fetchQuestion, updateSingleQuestion } from '../store/singleQuestionStore';

function EditQuestion() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const question = useSelector((state) => state.singleQuestion);

  const [text, setText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [imageA, setImageA] = useState(null);
  const [imageB, setImageB] = useState(null);
  const [previewImageA, setPreviewImageA] = useState('');
  const [previewImageB, setPreviewImageB] = useState('');

  useEffect(() => {
    dispatch(fetchQuestion(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (question) {
      setText(question.text || '');
      setOptionA(question.optionA || '');
      setOptionB(question.optionB || '');
      setPreviewImageA(question.imageA || '');
      setPreviewImageB(question.imageB || '');
    }
  }, [question]);

  const handleFileChangeA = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageA(file);
      setPreviewImageA(URL.createObjectURL(file));
    }
  };

  const handleFileChangeB = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageB(file);
      setPreviewImageB(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', id);
    formData.append('text', text);
    formData.append('optionA', optionA);
    formData.append('optionB', optionB);
    if (imageA) formData.append('imageA', imageA);
    if (imageB) formData.append('imageB', imageB);

    try {
      await dispatch(updateSingleQuestion(formData));
      alert('Question updated successfully!');
      history.push('/questions');
    } catch (error) {
      console.error('Failed to update question:', error);
      alert('Failed to update question.');
    }
  };

  return (
    <div className="edit-question-container">
      <h2 className="form-heading">Edit Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Question Text:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Option A:</label>
          <input
            type="text"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            className="form-input"
            required
          />

        </div>
        <div className="form-group">
          <label className="form-label">Image for Option A:</label>

          <input type="file" onChange={handleFileChangeA} className="form-input" />
          {previewImageA && <img src={previewImageA} alt="Option A" className="question-image-thumbnail" />}
        </div>
        <div className="form-group">
          <label className="form-label">Option B:</label>
          <input
            type="text"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Image for Option B:</label>
          <input type="file" onChange={handleFileChangeB} className="form-input" />
          {previewImageB && <img src={previewImageB} alt="Option B" className="question-image-thumbnail" />}
        </div>
        <button type="submit" className="submit-button">Update Question</button>
      </form>
    </div>
  );
}

export default EditQuestion;

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useHistory } from 'react-router-dom';
// import { fetchQuestion, updateSingleQuestion } from '../store/singleQuestionStore';

// function EditQuestion() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const question = useSelector((state) => state.singleQuestion);

//   const [text, setText] = useState('');
//   const [optionA, setOptionA] = useState('');
//   const [optionB, setOptionB] = useState('');
//   const [imageA, setImageA] = useState(null);
//   const [imageB, setImageB] = useState(null);
//   const [previewImageA, setPreviewImageA] = useState('');
//   const [previewImageB, setPreviewImageB] = useState('');

//   useEffect(() => {
//     dispatch(fetchQuestion(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (question) {
//       setText(question.text || '');
//       setOptionA(question.optionA || '');
//       setOptionB(question.optionB || '');
//       setPreviewImageA(question.imageA || '');
//       setPreviewImageB(question.imageB || '');
//       setImageA(question.imageA || null); // Added line
//       setImageB(question.imageB || null); // Added line
//     }
//   }, [question]);

//   const handleFileChangeA = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImageA(file);
//       setPreviewImageA(URL.createObjectURL(file));
//     }
//   };

//   const handleFileChangeB = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImageB(file);
//       setPreviewImageB(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('id', id);
//     formData.append('text', text);
//     formData.append('optionA', optionA);
//     formData.append('optionB', optionB);

//     // Always append imageA and imageB
//     if (imageA instanceof File) {
//       formData.append('imageA', imageA); // New image file
//     } else if (imageA) {
//       formData.append('imageA', imageA); // Existing image URL
//     }

//     if (imageB instanceof File) {
//       formData.append('imageB', imageB); // New image file
//     } else if (imageB) {
//       formData.append('imageB', imageB); // Existing image URL
//     }

//     try {
//       await dispatch(updateSingleQuestion(formData));
//       alert('Question updated successfully!');
//       history.push('/questions');
//     } catch (error) {
//       console.error('Failed to update question:', error);
//       alert('Failed to update question.');
//     }
//   };

//   return (
//     <div className="edit-question-container">
//       <h2 className="form-heading">Edit Question</h2>
//       <form onSubmit={handleSubmit}>
//         {/* ... rest of the form ... */}
//       </form>
//     </div>
//   );
// }

// export default EditQuestion;


import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createQuestion } from '../store/allQuestionsStore';

function CreateQuestion() {
  const dispatch = useDispatch();
  const { id: userId } = useSelector((state) => state.auth);

  const [text, setText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [imageA, setImageA] = useState(null);
  const [imageB, setImageB] = useState(null);
  const [previewUrlA, setPreviewUrlA] = useState(null);
  const [previewUrlB, setPreviewUrlB] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChangeA = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageA(file);
      setPreviewUrlA(URL.createObjectURL(file));
    }
  };

  const handleFileChangeB = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageB(file);
      setPreviewUrlB(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text || !optionA || !optionB) {
      setError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('text', text);
    formData.append('optionA', optionA);
    formData.append('optionB', optionB);
    formData.append('createdBy', userId);

    if (imageA) {
      formData.append('imageA', imageA);
    }
    if (imageB) {
      formData.append('imageB', imageB);
    }

    try {
      await dispatch(createQuestion(formData));

      // Clear form fields after submission
      setText('');
      setOptionA('');
      setOptionB('');
      setImageA(null);
      setImageB(null);
      setPreviewUrlA(null);
      setPreviewUrlB(null);
      setError('');
      setSuccess('Question created successfully!');
    } catch (error) {
      console.error('Failed to create question:', error);
      setError('Failed to create question. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="create-question-container">
      <h2 className="create-question-heading">Create a New Question</h2>
      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}
      <form onSubmit={handleSubmit} className="create-question-form">
        {/* Question Text */}
        <div className="form-group">
          <label htmlFor="question-text" className="form-label">Question Text</label>
          <textarea
            id="question-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="form-input textarea"
            placeholder="Enter your question here..."
          />
        </div>

        {/* Option A */}
        <div className="form-option">
          <h3 className="option-heading">Option A</h3>
          <div className="form-group">
            <label htmlFor="option-a-text" className="form-label">Option A Text</label>
            <input
              type="text"
              id="option-a-text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              required
              className="form-input"
              placeholder="Enter text for Option A"
            />
          </div>
          <div className="form-group">
            <label htmlFor="option-a-image" className="form-label">Image for Option A</label>
            <input
              type="file"
              id="option-a-image"
              accept="image/*"
              onChange={handleFileChangeA}
              className="form-input-file"
            />
            {previewUrlA && (
              <div className="image-preview">
                <img src={previewUrlA} alt="Preview for Option A" className="image-preview-img" />
              </div>
            )}
          </div>
        </div>

        {/* Option B */}
        <div className="form-option">
          <h3 className="option-heading">Option B</h3>
          <div className="form-group">
            <label htmlFor="option-b-text" className="form-label">Option B Text</label>
            <input
              type="text"
              id="option-b-text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              required
              className="form-input"
              placeholder="Enter text for Option B"
            />
          </div>
          <div className="form-group">
            <label htmlFor="option-b-image" className="form-label">Image for Option B</label>
            <input
              type="file"
              id="option-b-image"
              accept="image/*"
              onChange={handleFileChangeB}
              className="form-input-file"
            />
            {previewUrlB && (
              <div className="image-preview">
                <img src={previewUrlB} alt="Preview for Option B" className="image-preview-img" />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="form-submit-button">Create Question</button>
      </form>
    </div>
  );
}

export default CreateQuestion;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup } from '../store/allGroupsStore';
import { createGroupMember } from '../store/allGroupMembersStore';

function CreateGroup() {
  const dispatch = useDispatch();
  const { id: userId } = useSelector((state) => state.auth);

  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Set the URL for preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text) {
      setError('Group name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', text);
    formData.append('leaderId', userId);

    if (selectedFile) {
      formData.append('image', selectedFile); // Append the selected file to the form data
    }

    try {
      const createdGroup = await dispatch(createGroup(formData));

      if (createdGroup && createdGroup.id) {
        dispatch(createGroupMember({ groupId: createdGroup.id, userId }));
        setText('');
        setError('');
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        console.error('Failed to get created group ID');
        setError('Failed to create group. Already a group with that name!');
      }
    } catch (error) {
      console.error('Failed to create group or add member:', error);

      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data === 'There is already a group with that name!'
      ) {
        alert('There is already a group with that name!');
      } else {
        setError('Failed to create group.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-heading">Create a New Group</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <div>
          <label style={{textAlign: "center"}}>Group Name:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div >
          <label style={{textAlign: "center"}}>Group Image:</label>
          <input type="file"  onChange={handleFileChange} className="form-input-file"  />
        </div>
        {previewUrl && (
          <div className="preview-container">
            <img src={previewUrl} alt="Preview" style={{ maxWidth: '200px', height: 'auto' }} />
          </div>
        )}
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
}

export default CreateGroup;



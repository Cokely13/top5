import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { fetchGroup, updateSingleGroup } from '../store/singleGroupStore';

function EditGroup() {
  const { id } = useParams(); // Get group ID from URL
  const dispatch = useDispatch();
  const history = useHistory();
  const group = useSelector((state) => state.singleGroup);

  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    dispatch(fetchGroup(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (group) {
      setName(group.name || '');
      setPreviewImage(group.image || '');
    }
  }, [group]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    if (image) formData.append('image', image);

    try {
      await dispatch(updateSingleGroup(formData));
      alert('Group updated successfully!');
      history.push('/groups'); // Redirect to groups list after update
    } catch (error) {
      console.error('Failed to update group:', error);
      alert('Failed to update group.');
    }
  };

  return (
    <div className="edit-question-container">
      <h2 className="form-heading">Edit Group</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Group Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Group Image:</label>
          <input className="form-input" type="file" onChange={handleFileChange} />
          {previewImage && <img src={previewImage} alt="Group" className="question-image-thumbnail" />}
        </div>
        <button type="submit">Update Group</button>
      </form>
    </div>
  );
}

export default EditGroup;

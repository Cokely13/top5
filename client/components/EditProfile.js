import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'

function EditProfile() {
  const [selectedFile, setSelectedFile] = useState()

  const fileSelectedHandler = event => {
    setSelectedFile(event.target.files[0])
  }

  const fileUpload= () => {
    const fd = new FormData()
    fd.append('image', selectedFile, selectedFile.name);
    axios.post("")
  }

  return (
    <div>
      <input type="file" onChange={fileSelectedHandler}/>
    <button onClick={fileUpload}>Upload</button>
    </div>
  )
}

export default EditProfile

import React, { useState } from "react";
import './Images.css'

export default function Images({imgName, accept, callback}) {
  const [uplFile, setUplFile] = useState();
  const [preview, setPreview] = useState();

  const handleUploadClick = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    setPreview(URL.createObjectURL(file));
    reader.onloadend = function (e) {
      setUplFile(reader.result);
      callback(imgName, file.type, file, reader.result)
    }
  };

  return (
    <div>
      <p>{imgName}</p>
      <input
        accept={accept}
        className=''
        type="file"
        onChange={handleUploadClick}
      />
      {uplFile ? <img alt={imgName} className='imagePrev' src={preview} /> : null}
    </div>
  )
}

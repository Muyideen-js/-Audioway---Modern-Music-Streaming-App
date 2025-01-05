import React, { useState, useRef } from 'react';
import { FiUpload } from 'react-icons/fi';
import '../styles/Upload.css';

function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const audioFiles = newFiles.filter(file => file.type.startsWith('audio/'));
    setFiles(prev => [...prev, ...audioFiles]);
  };

  return (
    <div className="upload-container">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FiUpload className="upload-icon" />
        <h2>Drag & Drop your music files here</h2>
        <p>or</p>
        <button 
          className="browse-button"
          onClick={() => fileInputRef.current.click()}
        >
          Browse Files
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="audio/*"
          multiple
          hidden
        />
        <p className="file-types">Supported formats: MP3, WAV, AAC</p>
      </div>

      {files.length > 0 && (
        <div className="uploaded-files">
          <h3>Uploaded Files</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                <span>{file.name}</span>
                <span className="file-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Upload; 
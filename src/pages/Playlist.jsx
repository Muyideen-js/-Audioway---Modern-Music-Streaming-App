import React, { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import { FiPlay, FiPause, FiFolderPlus, FiTrash2, FiX } from 'react-icons/fi';
import '../styles/Playlist.css';
import './Playlist.css'; 
function DeleteAlert({ message, onConfirm, onCancel }) {
  return (
    <div className="alert-overlay">
      <div className="alert-content">
        <h3>Confirm Delete</h3>
        <p>{message}</p>
        <div className="alert-buttons">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="delete-btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function CreateFolderModal({ onClose, onCreate }) {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError('Please enter a folder name');
      return;
    }
    onCreate(folderName);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Folder</h3>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-folder-form">
          <div className="form-group">
            <label htmlFor="folderName">Folder Name</label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-btn">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Playlist() {
  const { state, dispatch } = useMusic();
  const { folders, currentTrack, isPlaying } = state;
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // For debugging
    console.log('Current folders:', folders);
  }, [folders]);

  const handlePlay = (track) => {
    if (currentTrack?.id === track.id) {
      dispatch({ type: 'SET_PLAYING', payload: !isPlaying });
    } else {
      dispatch({ type: 'SET_TRACK', payload: track });
      dispatch({ type: 'SET_PLAYING', payload: true });
    }
  };

  const handleDeleteFolder = (folderId, folderName) => {
    setDeleteAlert({
      message: `Are you sure you want to delete "${folderName}" and all its tracks?`,
      onConfirm: () => {
        dispatch({
          type: 'DELETE_FOLDER',
          payload: folderId
        });
        setDeleteAlert(null);
      }
    });
  };

  const handleRemoveFromFolder = (folderId, trackId, trackName) => {
    setDeleteAlert({
      message: `Remove "${trackName}" from this folder?`,
      onConfirm: () => {
        dispatch({
          type: 'REMOVE_FROM_FOLDER',
          payload: { folderId, trackId }
        });
        setDeleteAlert(null);
      }
    });
  };

  const handleCreateFolder = (folderName) => {
    dispatch({
      type: 'CREATE_FOLDER',
      payload: {
        id: Date.now().toString(),
        name: folderName,
        tracks: []
      }
    });
  };

  return (
    <div className="playlist-container">
      <div className="playlist-header">
        <h2>Your Folders</h2>
        <button 
          className="create-folder-btn" 
          onClick={() => setShowCreateModal(true)}
        >
          <FiFolderPlus /> Create New Folder
        </button>
      </div>

      <div className="folders-grid">
        {folders && folders.length > 0 ? (
          folders.map(folder => (
            <div key={folder.id} className="folder-card">
              <div className="folder-header">
                <h3>{folder.name}</h3>
                <button
                  className="delete-folder-btn"
                  onClick={() => handleDeleteFolder(folder.id, folder.name)}
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className="folder-tracks">
                {folder.tracks && folder.tracks.map(track => (
                  <div key={track.id} className="track-item">
                    <div className="track-info">
                      <img src={track.coverImage} alt={track.title} />
                      <div>
                        <h4>{track.title}</h4>
                        <p>{track.artist}</p>
                      </div>
                    </div>
                    <button
                      className="remove-track-btn"
                      onClick={() => handleRemoveFromFolder(folder.id, track.id, track.title)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-folders">
            <FiFolderPlus />
            <p>No folders yet</p>
            <button onClick={() => setShowCreateModal(true)}>
              Create your first folder
            </button>
          </div>
        )}
      </div>

      {deleteAlert && (
        <DeleteAlert
          message={deleteAlert.message}
          onConfirm={deleteAlert.onConfirm}
          onCancel={() => setDeleteAlert(null)}
        />
      )}

      {showCreateModal && (
        <CreateFolderModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateFolder}
        />
      )}
    </div>
  );
}

export default Playlist; 
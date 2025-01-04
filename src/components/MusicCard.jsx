import React, { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { FiPlus, FiFolderPlus, FiX } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';
import Toast from './Toast';
import '../styles/MusicCard.css';
import './MusicCard.css';


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

function MusicCard({ track }) {
  const { state, dispatch } = useMusic();
  const [showNoPreviewMessage, setShowNoPreviewMessage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [toast, setToast] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const handlePlay = (e) => {
    e.stopPropagation();
    
    const isCurrentTrack = state.currentTrack?.id === track.id;
    
    if (isCurrentTrack) {
      dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying });
    } else {
      dispatch({ 
        type: 'SET_TRACK', 
        payload: {
          id: track.id,
          title: track.title,
          artist: track.artist,
          coverImage: track.coverImage,
          previewUrl: track.previewUrl
        } 
      });
      dispatch({ type: 'SET_PLAYING', payload: true });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    setShowFolderModal(true);
  };

  const handleAddToFolder = (folderId) => {
    const trackToAdd = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      coverImage: track.coverImage,
      previewUrl: track.previewUrl
    };
    
    dispatch({ 
      type: 'ADD_TO_FOLDER', 
      payload: { 
        folderId, 
        track: trackToAdd 
      } 
    });
    
    setToast({
      message: 'Added to folder',
      type: 'success'
    });
    setShowFolderModal(false);
  };

  const handleCreateNewFolder = (folderName) => {
    const newFolder = {
      id: Date.now().toString(),
      name: folderName,
      tracks: []
    };
    
    dispatch({
      type: 'CREATE_FOLDER',
      payload: newFolder
    });

    dispatch({
      type: 'ADD_TO_FOLDER',
      payload: {
        folderId: newFolder.id,
        track: {
          id: track.id,
          title: track.title,
          artist: track.artist,
          coverImage: track.coverImage,
          previewUrl: track.previewUrl
        }
      }
    });

    setToast({
      message: 'Added to new folder',
      type: 'success'
    });
    setShowCreateModal(false);
    setShowFolderModal(false);
  };

  const handleCloseModal = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setShowFolderModal(false);
  };

  const isCurrentlyPlaying = state.currentTrack?.id === track.id && state.isPlaying;
  const hasPreview = track.previewUrl && !track.previewUrl.includes('embed');

  return (
    <>
      <div className="music-card" data-testid="music-card">
        <div className="cover-container">
          <img 
            src={imageError ? '/default-album.png' : track.coverImage} 
            alt={`${track.title} by ${track.artist}`}
            onError={() => setImageError(true)}
          />
          <div className="hover-overlay">
            <button 
              className="play-button"
              onClick={handlePlay}
              title={isCurrentlyPlaying ? 'Pause' : 'Play'}
            >
              {state.currentTrack?.id === track.id && state.isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button 
              className="add-to-playlist-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFolderModal(true);
              }}
              title="Add to playlist"
            >
              <FiPlus />
            </button>
          </div>
          {showNoPreviewMessage && (
            <div className="preview-message">
              Preview not available
            </div>
          )}
        </div>
        <div className="card-info">
          <h3 title={track.title}>{track.title}</h3>
          <p title={track.artist}>{track.artist}</p>
        </div>
      </div>

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add to Folder</h3>
              <button className="close-button" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {state.folders && state.folders.length > 0 ? (
                <div className="folders-list">
                  {state.folders.map(folder => (
                    <div 
                      key={folder.id}
                      className="folder-item"
                      onClick={() => handleAddToFolder(folder.id)}
                    >
                      <FiFolderPlus />
                      <span>{folder.name}</span>
                      <span className="track-count">
                        {folder.tracks?.length || 0} tracks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-folders-message">No folders yet</div>
              )}
              <button 
                className="create-folder-button"
                onClick={() => setShowCreateModal(true)}
              >
                <FiFolderPlus />
                Create New Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateFolderModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateNewFolder}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default MusicCard; 
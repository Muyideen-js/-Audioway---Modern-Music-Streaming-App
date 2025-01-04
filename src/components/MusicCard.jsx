import React, { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';
import Toast from './Toast';
import '../styles/MusicCard.css';

function MusicCard({ track }) {
  const { state, dispatch } = useMusic();
  const [showNoPreviewMessage, setShowNoPreviewMessage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [toast, setToast] = useState(null);
  
  const handlePlay = () => {
    if (!track.previewUrl || track.previewUrl.includes('embed')) {
      setShowNoPreviewMessage(true);
      setTimeout(() => setShowNoPreviewMessage(false), 3000);
      return;
    }

    const isCurrentTrack = state.currentTrack?.id === track.id;
    
    if (isCurrentTrack) {
      dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying });
    } else {
      dispatch({ type: 'SET_TRACK', payload: track });
      dispatch({ type: 'SET_PLAYING', payload: true });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    console.log('Attempting to add track:', track);
    
    const isAlreadyInPlaylist = state.playlists.some(item => item.id === track.id);
    
    if (isAlreadyInPlaylist) {
      console.log('Track already exists in playlist');
      setToast({
        message: 'Track is already in your playlist',
        type: 'error'
      });
    } else {
      console.log('Adding new track to playlist');
      dispatch({ type: 'ADD_TO_PLAYLIST', payload: track });
      setToast({
        message: 'Added to your playlist',
        type: 'success'
      });
    }
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
            onError={handleImageError}
          />
          <div className="hover-overlay">
            <button 
              className={`play-button ${!hasPreview ? 'disabled' : ''}`}
              onClick={handlePlay}
              disabled={!hasPreview}
              title={!hasPreview ? 'Preview not available' : 'Play preview'}
              aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
            >
              {isCurrentlyPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button 
              className="add-to-playlist-button"
              onClick={handleAddToPlaylist}
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
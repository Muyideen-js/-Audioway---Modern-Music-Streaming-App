import React, { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useMusic } from '../context/MusicContext';
import '../styles/MusicCard.css';

function MusicCard({ track }) {
  const { state, dispatch } = useMusic();
  const [showNoPreviewMessage, setShowNoPreviewMessage] = useState(false);
  const [imageError, setImageError] = useState(false);
  
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

  const isCurrentlyPlaying = state.currentTrack?.id === track.id && state.isPlaying;
  const hasPreview = track.previewUrl && !track.previewUrl.includes('embed');

  return (
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
  );
}

export default MusicCard; 
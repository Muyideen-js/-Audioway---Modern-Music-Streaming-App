import React, { useState } from 'react';
import { FiPlay, FiPause, FiPlus } from 'react-icons/fi';
import { usePlaylist } from '../context/PlaylistContext';

function SongCard({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToPlaylist } = usePlaylist();

  const handlePlay = (song) => {
    // Implement play/pause logic here
  };

  return (
    <div className="song-card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* ... existing card content ... */}
      
      {isHovered && (
        <div className="song-card-overlay">
          <button className="play-button" onClick={() => handlePlay(song)}>
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          <button className="playlist-button" onClick={() => addToPlaylist(song)}>
            <FiPlus /> Add to Playlist
          </button>
        </div>
      )}
    </div>
  );
}

export default SongCard;

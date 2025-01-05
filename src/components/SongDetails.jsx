import React, { useState, useEffect } from 'react';
import { FiClock, FiMusic, FiCalendar, FiBarChart2, FiLoader } from 'react-icons/fi';
import { getLyrics, getSongDetails } from '../services/musicService';
import '../styles/SongDetails.css';

function SongDetails({ track, onClose }) {
  const [details, setDetails] = useState(null);
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSongInfo() {
      try {
        setLoading(true);
        const [songLyrics, songDetails] = await Promise.all([
          getLyrics(track.title, track.artist),
          getSongDetails(track.title, track.artist)
        ]);
        
        if (songLyrics) {
          setLyrics(songLyrics);
        }
        if (songDetails) {
          setDetails(songDetails);
        }
      } catch (err) {
        console.error('Error loading song information:', err);
        setError('Failed to load song details');
      } finally {
        setLoading(false);
      }
    }

    if (track) {
      loadSongInfo();
    }
  }, [track]);

  if (loading) {
    return (
      <div className="song-details-loading">
        <FiLoader className="loading-spinner" />
        <p>Loading song details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="song-details-error">{error}</div>;
  }

  return (
    <div className="song-details">
      <div className="song-header">
        <img src={track.coverImage} alt={track.title} />
        <div className="song-info">
          <h2>{track.title}</h2>
          <p className="artist">{track.artist}</p>
        </div>
      </div>

      <div className="song-stats">
        <div className="stat-item">
          <FiClock />
          <span>{Math.floor(track.duration / 1000 / 60)}:{String(Math.floor((track.duration / 1000) % 60)).padStart(2, '0')}</span>
        </div>
        <div className="stat-item">
          <FiBarChart2 />
          <span>Popularity: {track.popularity}%</span>
        </div>
        {details && (
          <>
            <div className="stat-item">
              <FiCalendar />
              <span>Released: {details.releaseDate}</span>
            </div>
            <div className="stat-item">
              <FiMusic />
              <span>Album: {details.album}</span>
            </div>
          </>
        )}
      </div>

      <div className="lyrics-section">
        <h3>Lyrics</h3>
        <div className="lyrics-content">
          {lyrics ? (
            <pre>{lyrics}</pre>
          ) : (
            <p className="no-lyrics">Lyrics not available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SongDetails;
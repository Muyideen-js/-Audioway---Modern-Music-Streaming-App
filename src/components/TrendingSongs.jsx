import React, { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import MusicCard from './MusicCard';
import { FiLoader } from 'react-icons/fi';
import { fetchTrendingTracks } from '../services/musicService';
import '../styles/TrendingSongs.css';

function TrendingSongs() {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrendingSongs = async () => {
      try {
        setLoading(true);
        const songs = await fetchTrendingTracks();
        setTrendingSongs(songs);
      } catch (err) {
        console.error('Error loading trending songs:', err);
        setError('Failed to load trending songs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTrendingSongs();
  }, []);

  if (loading) {
    return (
      <div className="trending-songs-loading">
        <FiLoader className="loading-spinner" />
        <p>Loading trending songs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-songs-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="trending-songs-container">
      <div className="trending-songs-header">
        <h1>Trending Songs</h1>
        <p>Listen to what's hot right now</p>
      </div>

      {trendingSongs.length === 0 ? (
        <div className="no-songs">
          <p>No trending songs available at the moment</p>
        </div>
      ) : (
        <div className="trending-songs-grid">
          {trendingSongs.map((song, index) => (
            <div key={song.id} className="trending-song-card">
              <div className="trending-number">{index + 1}</div>
              <MusicCard track={song} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendingSongs; 
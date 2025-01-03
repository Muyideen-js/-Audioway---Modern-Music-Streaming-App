import React, { useState, useEffect } from 'react';
import { fetchTrendingTracks, checkTokenValidity } from '../services/musicService';
import MusicCard from './MusicCard';

function Home() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTracks() {
      try {
        setLoading(true);
        
        // Check token validity first
        const isValid = await checkTokenValidity();
        if (!isValid) {
          window.location.href = '/login';
          return;
        }

        const fetchedTracks = await fetchTrendingTracks();
        console.log('Fetched tracks:', fetchedTracks);
        setTracks(fetchedTracks);
      } catch (error) {
        console.error('Error loading tracks:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadTracks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (tracks.length === 0) return <div>No tracks found</div>;

  return (
    <div className="home">
      <div className="tracks-grid">
        {tracks.map(track => (
          <MusicCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}

export default Home; 
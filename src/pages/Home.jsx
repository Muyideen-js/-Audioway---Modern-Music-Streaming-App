import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';
import { fetchTrendingTracks, getToken } from '../services/musicService';
import MusicCard from '../components/MusicCard';
import SocialModal from '../components/SocialModal';
import './Home.css';

function Home() {
  const { dispatch } = useMusic();
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showSocialModal, setShowSocialModal] = useState(false);

  useEffect(() => {
    async function loadTracks() {
      try {
        setLoading(true);
        setError(null);

        // Check if we have a token
        const token = getToken();
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        const tracks = await fetchTrendingTracks();
        console.log('Fetched tracks:', tracks); // Debug log
        
        if (tracks.length === 0) {
          setError('No tracks found. Try refreshing the page.');
        } else {
          setTrendingTracks(tracks);
        }
      } catch (err) {
        console.error('Error loading tracks:', err);
        setError('Failed to load tracks. Please try again later.');
        if (err.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    loadTracks();
  }, [navigate]);

  useEffect(() => {
    // Check if it's the first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowSocialModal(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <FiLoader className="loading-spinner" />
        <p>Loading tracks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <SocialModal 
        isOpen={showSocialModal} 
        onClose={() => setShowSocialModal(false)} 
      />
      <div className="Published-by">
      <div className="published-by">
        <p>Built with <span className="heart">♥</span> by <span className="author">Muyideen.jsx</span>🚀</p>
      </div>
      </div>
      <h1>For You</h1>
      <div className="tracks-grid">
        {trendingTracks.map(track => (
          <MusicCard key={track.id} track={track} />
        ))}
      </div>
      
    </div>
  );
}

export default Home;
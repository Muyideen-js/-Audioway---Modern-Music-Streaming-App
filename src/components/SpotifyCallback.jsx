import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeSpotify } from '../services/musicService';

function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      try {
        const success = await initializeSpotify();
        if (success) {
          navigate('/');
        } else {
          console.error('Failed to initialize Spotify');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error during Spotify initialization:', error);
        navigate('/login');
      }
    }

    handleCallback();
  }, [navigate]);

  return <div>Connecting to Spotify...</div>;
}

export default SpotifyCallback; 
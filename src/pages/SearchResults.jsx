import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchTracks } from '../services/musicService';
import MusicCard from '../components/MusicCard';
import { FiLoader } from 'react-icons/fi';
import './SearchResults.css';

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search query from URL parameters
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const tracks = await searchTracks(query);
        setResults(tracks);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <FiLoader className="loading-spinner" />
        <p>Searching...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Search Results for "{query}"</h1>
        <p>{results.length} tracks found</p>
      </div>
      {results.length > 0 ? (
        <div className="tracks-grid">
          {results.map(track => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      ) : (
        <div className="no-results-message">
          <p>No tracks found for "{query}"</p>
          <button onClick={() => navigate('/')}>Return Home</button>
        </div>
      )}
    </div>
  );
}

export default SearchResults; 
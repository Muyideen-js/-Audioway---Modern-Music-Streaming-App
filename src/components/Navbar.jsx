import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import { searchTracks } from '../services/musicService';
import { FiLogOut, FiSearch, FiMusic } from 'react-icons/fi';
import './Navbar.css';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const searchContainerRef = useRef(null);
  const { dispatch } = useMusic();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      try {
        setIsSearching(true);
        const results = await searchTracks(query);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  const addToSearchHistory = (track) => {
    setSearchHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.id !== track.id);
      const updatedHistory = [track, ...newHistory].slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const handleTrackSelect = (track) => {
    dispatch({ type: 'SET_TRACK', payload: track });
    addToSearchHistory(track);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo-wrapper">
          <div className="logo">
            Audio<span className="way-text">Way</span>
            <FiMusic className="music-icon" />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="search-container" ref={searchContainerRef}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for songs..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setShowResults(true)}
          />
          {isSearching && <span className="search-loading">•••</span>}
          {showResults && (
            <div className="search-results">
              {searchHistory.length > 0 && (
                <div className="search-history">
                  <div className="search-section-title">Recent Searches</div>
                  {searchHistory.map(track => (
                    <div
                      key={`history-${track.id}`}
                      className="search-result-item history-item"
                      onClick={() => handleTrackSelect(track)}
                    >
                      <img src={track.coverImage} alt={track.title} />
                      <div className="track-info">
                        <h4>{track.title}</h4>
                        <p>{track.artist}</p>
                      </div>
                    </div>
                  ))}
                  <div className="search-divider"></div>
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length > 0 && (
                <>
                  <div className="search-section-title">Search Results</div>
                  {searchResults.map(track => (
                    <div
                      key={track.id}
                      className="search-result-item"
                      onClick={() => handleTrackSelect(track)}
                    >
                      <img src={track.coverImage} alt={track.title} />
                      <div className="track-info">
                        <h4>{track.title}</h4>
                        <p>{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
              
              {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="no-results">No songs found</div>
              )}
            </div>
          )}
        </form>
      </div>
      <div className="nav-right">
        <button onClick={handleLogout} className="logout-btn">
          <FiLogOut />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 
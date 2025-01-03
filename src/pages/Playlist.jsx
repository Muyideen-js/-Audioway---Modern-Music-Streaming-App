import { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import MusicCard from '../components/MusicCard';
import './Playlist.css';
import { saveAs } from 'file-saver';

function Playlist() {
  const { state, dispatch } = useMusic();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'tracks', 'date'

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      dispatch({
        type: 'CREATE_PLAYLIST',
        payload: {
          id: Date.now(),
          name: newPlaylistName,
          tracks: [],
          createdAt: new Date().toISOString()
        }
      });
      setNewPlaylistName('');
    }
  };

  const filteredAndSortedPlaylists = state.userPlaylists
    .filter(playlist => 
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.tracks.some(track => 
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'tracks':
          return b.tracks.length - a.tracks.length;
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const handleDeletePlaylist = (playlistId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      dispatch({ type: 'DELETE_PLAYLIST', payload: playlistId });
      if (selectedPlaylist === playlistId) {
        setSelectedPlaylist(null);
      }
    }
  };

  const handleRemoveTrack = (playlistId, trackId, event) => {
    event.stopPropagation();
    dispatch({
      type: 'REMOVE_TRACK_FROM_PLAYLIST',
      payload: { playlistId, trackId }
    });
  };

  const handleExportPlaylists = () => {
    const exportData = {
      playlists: state.userPlaylists,
      playStats: state.playStats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    saveAs(blob, `music-playlists-${new Date().toLocaleDateString()}.json`);
  };

  const handleImportPlaylists = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.playlists) {
          dispatch({ type: 'IMPORT_PLAYLISTS', payload: data.playlists });
        }
        
        if (data.playStats) {
          dispatch({ type: 'IMPORT_PLAY_STATS', payload: data.playStats });
        }
      } catch (error) {
        console.error('Error importing playlists:', error);
        alert('Invalid playlist file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="playlist-page">
      <div className="playlist-controls">
        <div className="create-playlist">
          <input
            type="text"
            placeholder="New Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') createPlaylist();
            }}
          />
          <button onClick={createPlaylist}>Create Playlist</button>
        </div>
        
        <div className="playlist-filters">
          <input
            type="text"
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="tracks">Sort by Tracks</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>

        <div className="playlist-actions">
          <button 
            className="export-btn"
            onClick={handleExportPlaylists}
          >
            Export Playlists
          </button>
          <label className="import-btn">
            Import Playlists
            <input
              type="file"
              accept=".json"
              onChange={handleImportPlaylists}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="playlists-grid">
        {filteredAndSortedPlaylists.map(playlist => (
          <div 
            key={playlist.id} 
            className={`playlist-card ${selectedPlaylist === playlist.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlaylist(playlist.id)}
          >
            <div className="playlist-header">
              <h3>{playlist.name}</h3>
              <button
                className="delete-playlist-btn"
                onClick={(e) => handleDeletePlaylist(playlist.id, e)}
              >
                ×
              </button>
            </div>
            <p>{playlist.tracks.length} tracks</p>
            <div className="playlist-tracks">
              {playlist.tracks.map(track => (
                <div key={track.id} className="playlist-track-item">
                  <MusicCard
                    track={track}
                    onPlay={() => dispatch({ type: 'SET_TRACK', payload: track })}
                  />
                  <button
                    className="remove-track-btn"
                    onClick={(e) => handleRemoveTrack(playlist.id, track.id, e)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist; 
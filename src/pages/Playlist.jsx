import React from 'react';
import { useMusic } from '../context/MusicContext';
import './Playlist.css';

function Playlist() {
  const { state, dispatch } = useMusic();

  console.log('Playlist render - Current playlists:', state.playlists); // Debug log

  return (
    <div className="playlist-page">
      <h1>My Playlist ({state.playlists?.length || 0} tracks)</h1>
      <div className="playlist-container">
        {!state.playlists || state.playlists.length === 0 ? (
          <p className="empty-playlist">Your playlist is empty. Add some tracks!</p>
        ) : (
          <div className="playlist-tracks">
            {state.playlists.map((track) => (
              <div key={track.id} className="playlist-track">
                <div className="track-info-container">
                  <img 
                    src={track.coverImage} 
                    alt={track.title}
                    className="track-image"
                    onError={(e) => {
                      e.target.src = '/default-album.png';
                      console.log('Image load error for track:', track);
                    }}
                  />
                  <div className="track-details">
                    <h3>{track.title}</h3>
                    <p>{track.artist}</p>
                  </div>
                </div>
                <div className="track-actions">
                  <button
                    className="remove-track-btn"
                    onClick={() => {
                      console.log('Removing track:', track.id);
                      dispatch({ type: 'REMOVE_FROM_PLAYLIST', payload: track.id });
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Playlist; 
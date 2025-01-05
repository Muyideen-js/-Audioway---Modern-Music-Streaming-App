import React from 'react';
import { useMusic } from '../context/MusicContext';
import MusicCard from './MusicCard';
import '../styles/RecentlyPlayed.css';

function RecentlyPlayed() {
  const { state } = useMusic();
  const { recentlyPlayed } = state;

  return (
    <div className="recently-played-container">
      <div className="recently-played-header">
        <h1>Recently Played</h1>
        <p>{recentlyPlayed.length} tracks</p>
      </div>

      {(!recentlyPlayed || recentlyPlayed.length === 0) ? (
        <div className="no-history">
          <p>No listening history yet</p>
          <span>Start playing some tracks to see them here</span>
        </div>
      ) : (
        <div className="tracks-grid">
          {recentlyPlayed.map((track, index) => (
            <MusicCard 
              key={`${track.id}-${index}`} 
              track={track} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentlyPlayed; 
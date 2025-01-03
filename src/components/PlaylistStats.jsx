import { useMusic } from '../context/MusicContext';
import './PlaylistStats.css';

function PlaylistStats({ playlist }) {
  const { state } = useMusic();
  const { playStats } = state;

  const totalPlays = playlist.tracks.reduce((sum, track) => 
    sum + (playStats.trackPlayCounts[track.id] || 0), 0);

  const mostPlayedTrack = playlist.tracks.reduce((most, track) => {
    const plays = playStats.trackPlayCounts[track.id] || 0;
    return plays > (playStats.trackPlayCounts[most?.id] || 0) ? track : most;
  }, null);

  const lastPlayedTrack = playlist.tracks.reduce((latest, track) => {
    const lastPlayed = playStats.lastPlayed[track.id];
    if (!lastPlayed) return latest;
    return !latest?.lastPlayed || new Date(lastPlayed) > new Date(latest.lastPlayed)
      ? { ...track, lastPlayed }
      : latest;
  }, null);

  const totalDuration = playlist.tracks.length * 30; // Assuming 30s preview duration

  return (
    <div className="playlist-stats">
      <h3>Playlist Stats</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Total Tracks</span>
          <span className="stat-value">{playlist.tracks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Plays</span>
          <span className="stat-value">{totalPlays}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Duration</span>
          <span className="stat-value">{Math.floor(totalDuration / 60)}m {totalDuration % 60}s</span>
        </div>
        {mostPlayedTrack && (
          <div className="stat-item">
            <span className="stat-label">Most Played</span>
            <span className="stat-value">
              {mostPlayedTrack.title} ({playStats.trackPlayCounts[mostPlayedTrack.id]} plays)
            </span>
          </div>
        )}
        {lastPlayedTrack && (
          <div className="stat-item">
            <span className="stat-label">Last Played</span>
            <span className="stat-value">
              {lastPlayedTrack.title} ({new Date(lastPlayedTrack.lastPlayed).toLocaleDateString()})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistStats; 
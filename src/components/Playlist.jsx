import { usePlaylist } from '../context/PlaylistContext';
import { FiTrash2 } from 'react-icons/fi';
import './Playlist.css';

function Playlist() {
  const { playlist, removeFromPlaylist } = usePlaylist();

  return (
    <div className="playlist-container">
      <h2>My Playlist</h2>
      {playlist.length === 0 ? (
        <p>Your playlist is empty</p>
      ) : (
        <div className="playlist-songs">
          {playlist.map((song) => (
            <div key={song.id} className="playlist-song-item">
              <img src={song.thumbnail} alt={song.title} />
              <div className="song-info">
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
              <button 
                className="remove-button"
                onClick={() => removeFromPlaylist(song.id)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Playlist; 
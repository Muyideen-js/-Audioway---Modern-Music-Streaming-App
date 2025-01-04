import { createContext, useContext, useState } from 'react';

const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);

  const addToPlaylist = (song) => {
    if (!playlist.some(item => item.id === song.id)) {
      setPlaylist([...playlist, song]);
    }
  };

  const removeFromPlaylist = (songId) => {
    setPlaylist(playlist.filter(song => song.id !== songId));
  };

  return (
    <PlaylistContext.Provider value={{ playlist, addToPlaylist, removeFromPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  return useContext(PlaylistContext);
} 
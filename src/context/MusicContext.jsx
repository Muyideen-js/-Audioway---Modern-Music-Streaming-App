import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const MusicContext = createContext();

const initialState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  folders: [],
  playlists: []
};

function musicReducer(state, action) {
  switch (action.type) {
    case 'SET_TRACK':
      return {
        ...state,
        currentTrack: action.payload,
        currentTime: 0
      };
    case 'SET_PLAYING':
      return {
        ...state,
        isPlaying: action.payload
      };
    case 'UPDATE_TIME':
      return {
        ...state,
        currentTime: action.payload
      };
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload
      };
    case 'CREATE_FOLDER':
      const newFolders = [...state.folders, action.payload];
      localStorage.setItem('folders', JSON.stringify(newFolders));
      return {
        ...state,
        folders: newFolders
      };
    case 'ADD_TO_FOLDER':
      const updatedFolders = state.folders.map(folder => 
        folder.id === action.payload.folderId
          ? {
              ...folder,
              tracks: [...(folder.tracks || []), action.payload.track]
            }
          : folder
      );
      localStorage.setItem('folders', JSON.stringify(updatedFolders));
      return {
        ...state,
        folders: updatedFolders
      };
    case 'LOAD_FOLDERS':
      return {
        ...state,
        folders: action.payload
      };
    case 'DELETE_FOLDER':
      const foldersAfterDelete = state.folders.filter(
        folder => folder.id !== action.payload
      );
      localStorage.setItem('folders', JSON.stringify(foldersAfterDelete));
      return {
        ...state,
        folders: foldersAfterDelete
      };
    case 'REMOVE_FROM_FOLDER':
      const foldersAfterRemove = state.folders.map(folder =>
        folder.id === action.payload.folderId
          ? {
              ...folder,
              tracks: folder.tracks.filter(track => track.id !== action.payload.trackId)
            }
          : folder
      );
      localStorage.setItem('folders', JSON.stringify(foldersAfterRemove));
      return {
        ...state,
        folders: foldersAfterRemove
      };
    // ... other cases ...
    default:
      return state;
  }
}

export function MusicProvider({ children }) {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const audioRef = useRef(new Audio());

  // Handle track changes
  useEffect(() => {
    if (state.currentTrack?.previewUrl) {
      audioRef.current.src = state.currentTrack.previewUrl;
      
      // Set up audio event listeners
      const audio = audioRef.current;
      
      audio.addEventListener('loadedmetadata', () => {
        dispatch({ type: 'SET_DURATION', payload: audio.duration });
      });

      audio.addEventListener('timeupdate', () => {
        dispatch({ type: 'UPDATE_TIME', payload: audio.currentTime });
      });

      audio.addEventListener('ended', () => {
        dispatch({ type: 'SET_PLAYING', payload: false });
        dispatch({ type: 'UPDATE_TIME', payload: 0 });
      });

      if (state.isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing audio:', error);
            dispatch({ type: 'SET_PLAYING', payload: false });
          });
        }
      }
    }

    return () => {
      const audio = audioRef.current;
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [state.currentTrack]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    
    if (state.isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          dispatch({ type: 'SET_PLAYING', payload: false });
        });
      }
    } else {
      audio.pause();
    }
  }, [state.isPlaying]);

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      ...state,
      currentTime: 0, // Don't save current time
      isPlaying: false // Don't save playing state
    };
    localStorage.setItem('musicState', JSON.stringify(stateToSave));
  }, [state]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('musicState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      dispatch({ type: 'LOAD_STATE', payload: parsedState });
    }
  }, []);

  // Load folders from localStorage on mount
  useEffect(() => {
    const savedFolders = localStorage.getItem('folders');
    if (savedFolders) {
      dispatch({ 
        type: 'LOAD_FOLDERS', 
        payload: JSON.parse(savedFolders) 
      });
    }
  }, []);

  return (
    <MusicContext.Provider value={{ state, dispatch, audioRef }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}

export default MusicContext;
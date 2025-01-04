import { createContext, useContext, useReducer, useEffect } from 'react';

const MusicContext = createContext();

// Load playlists from localStorage
const getInitialState = () => {
  try {
    const savedState = localStorage.getItem('musicState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }

  return {
    currentTrack: null,
    isPlaying: false,
    playlists: [], // Initialize empty array if no saved state
  };
};

function musicReducer(state, action) {
  let newState;

  switch (action.type) {
    case 'SET_TRACK':
      newState = {
        ...state,
        currentTrack: action.payload,
      };
      break;

    case 'SET_PLAYING':
      newState = {
        ...state,
        isPlaying: action.payload,
      };
      break;

    case 'ADD_TO_PLAYLIST':
      // Check if track already exists
      const exists = state.playlists.some(track => track.id === action.payload.id);
      if (!exists) {
        newState = {
          ...state,
          playlists: [...state.playlists, action.payload]
        };
        console.log('Adding track to playlist:', action.payload);
        console.log('New playlist state:', newState.playlists);
      } else {
        return state;
      }
      break;

    case 'REMOVE_FROM_PLAYLIST':
      newState = {
        ...state,
        playlists: state.playlists.filter(track => track.id !== action.payload)
      };
      break;

    default:
      return state;
  }

  // Save entire state to localStorage after each update
  try {
    localStorage.setItem('musicState', JSON.stringify(newState));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }

  return newState;
}

export function MusicProvider({ children }) {
  const [state, dispatch] = useReducer(musicReducer, getInitialState());

  // Debug logging
  useEffect(() => {
    console.log('MusicContext - Current state:', state);
    console.log('MusicContext - Playlists:', state.playlists);
  }, [state]);

  return (
    <MusicContext.Provider value={{ state, dispatch }}>
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
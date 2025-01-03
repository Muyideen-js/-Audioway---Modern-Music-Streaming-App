import { useRef, useEffect, useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import './AudioPlayer.css';

function AudioPlayer() {
  const { state, dispatch } = useMusic();
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentTrack, isPlaying } = state;

  // Handle track changes
  useEffect(() => {
    if (currentTrack?.previewUrl) {
      console.log('New track selected:', currentTrack.previewUrl);
      setIsLoading(true);
      
      // Reset audio element
      audioRef.current.pause();
      audioRef.current.src = currentTrack.previewUrl;
      audioRef.current.load();
      audioRef.current.volume = volume;
      
      // Only autoplay if isPlaying is true
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Playback started successfully');
              setIsLoading(false);
            })
            .catch(error => {
              console.error('Playback failed:', error);
              setIsLoading(false);
              dispatch({ type: 'SET_PLAYING', payload: false });
            });
        }
      }
    }
  }, [currentTrack?.previewUrl]); // Only trigger on preview URL changes

  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying && !isLoading) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Play failed:', error);
          dispatch({ type: 'SET_PLAYING', payload: false });
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isLoading]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = (e.pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
    const newTime = clickPosition * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const togglePlay = () => {
    if (currentTrack && !isLoading) {
      dispatch({ type: 'SET_PLAYING', payload: !isPlaying });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="audio-player">
      <div className="player-left">
        <img src={currentTrack.coverImage} alt={currentTrack.title} />
        <div className="track-info">
          <h3>{currentTrack.title}</h3>
          <p>{currentTrack.artist}</p>
        </div>
      </div>

      <div className="player-center">
        <div className="controls">
          <button 
            className={`play-button ${isLoading ? 'loading' : ''}`} 
            onClick={togglePlay}
            disabled={isLoading}
          >
            {isLoading ? '...' : isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
        <div className="progress-container">
          <div className="progress-bar" onClick={handleProgressClick}>
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="player-right">
        <button className="volume-button" onClick={toggleMute}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => dispatch({ type: 'SET_PLAYING', payload: false })}
        onError={(e) => {
          console.error('Audio error:', e);
          setIsLoading(false);
          dispatch({ type: 'SET_PLAYING', payload: false });
        }}
        onCanPlay={() => {
          console.log('Audio can play');
          setIsLoading(false);
        }}
      />
    </div>
  );
}

export default AudioPlayer;
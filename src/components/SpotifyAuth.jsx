import { useEffect } from 'react';
import { setSpotifyAccessToken } from '../services/musicService';
import { spotifyConfig } from '../config/spotify';

function SpotifyAuth() {
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("spotify_token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("spotify_token", token);
    }

    if (token) {
      setSpotifyAccessToken(token);
    }
  }, []);

  const handleLogin = () => {
    const scope = spotifyConfig.scopes.join(' ');
    const params = new URLSearchParams({
      client_id: spotifyConfig.clientId,
      response_type: 'token',
      redirect_uri: spotifyConfig.redirectUri,
      scope,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  return (
    <button onClick={handleLogin}>Connect with Spotify</button>
  );
}

export default SpotifyAuth; 
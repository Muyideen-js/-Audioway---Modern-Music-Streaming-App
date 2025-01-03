import { spotifyConfig } from '../config/spotify';
import './Login.css';

function Login() {
  const handleLogin = () => {
    // Clear any existing tokens
    localStorage.removeItem('spotify_token');
    
    const state = Math.random().toString(36).substring(7);
    const scopes = spotifyConfig.scopes.join(' ');
    
    const params = new URLSearchParams({
      client_id: spotifyConfig.clientId,
      response_type: 'token',
      redirect_uri: spotifyConfig.redirectUri,
      scope: scopes,
      state: state,
      show_dialog: true // Force show the Spotify login dialog
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Music App</h1>
        <p>Connect with Spotify to start listening</p>
        <button onClick={handleLogin} className="login-button">
          Connect with Spotify
        </button>
      </div>
    </div>
  );
}

export default Login; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AudioPlayer from './components/AudioPlayer';
import Home from './pages/Home';
import Login from './pages/Login';
import SpotifyCallback from './components/SpotifyCallback';
import ProtectedRoute from './components/ProtectedRoute';
import SearchResults from './pages/SearchResults';
import './styles/theme.css';

function App() {
  return (
    <MusicProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Sidebar />
            <div className="content-area">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/callback" element={<SpotifyCallback />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchResults />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
          <AudioPlayer />
        </div>
      </Router>
    </MusicProvider>
  );
}

export default App;

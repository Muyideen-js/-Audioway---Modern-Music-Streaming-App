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
import Playlist from './pages/Playlist';
import RecentlyPlayed from './components/RecentlyPlayed';
import Upload from './components/Upload';
import TrendingSongs from './components/TrendingSongs';
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
                <Route path="/playlist" element={<Playlist />} />
                <Route path="/recently-played" element={
                  <ProtectedRoute>
                    <RecentlyPlayed />
                  </ProtectedRoute>
                } />
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                } />
                <Route path="/trending-songs" element={
                  <ProtectedRoute>
                    <TrendingSongs />
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

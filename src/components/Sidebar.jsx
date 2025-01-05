import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiTrendingUp, 
  FiDisc, 
  FiClock, 
  FiUpload,
  FiBarChart2,
  FiMusic
} from 'react-icons/fi';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>BROWSE</h3>
        <ul>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              <FiHome />
              Home
            </Link>
          </li>
          <li>
            <Link to="/trending-songs" className={location.pathname === '/trending-songs' ? 'active' : ''}>
              <FiTrendingUp />
              Trending Songs
            </Link>
          </li>
          <li>
            <Link to="/recently-played" className={location.pathname === '/recently-played' ? 'active' : ''}>
              <FiDisc />
              Recently Played
            </Link>
          </li>
          <li>
            <Link to="/playlist" className={location.pathname === '/playlist' ? 'active' : ''}>
              <FiClock />
              Playlist
            </Link>
          </li>
          <li>
            <Link to="/upload" className={location.pathname === '/upload' ? 'active' : ''}>
              <FiUpload />
              Upload
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="sidebar-section">
        <h3>CHARTS</h3>
        <ul>
          <li>
            <Link to="/top-songs" className={location.pathname === '/top-songs' ? 'active' : ''}>
              <FiBarChart2 />
              Top Songs
            </Link>
          </li>
          <li>
            <Link to="/top-albums" className={location.pathname === '/top-albums' ? 'active' : ''}>
              <FiMusic />
              Top Albums
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar; 
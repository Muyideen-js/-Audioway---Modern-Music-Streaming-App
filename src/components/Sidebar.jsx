import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiTrendingUp, 
  FiDisc, 
  FiClock, 
  FiPlus,
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
            <Link to="/trending-albums" className={location.pathname === '/trending-albums' ? 'active' : ''}>
              <FiDisc />
              Trending Albums
            </Link>
          </li>
          <li>
            <Link to="/recently-supported" className={location.pathname === '/recently-supported' ? 'active' : ''}>
              <FiClock />
              Recently Supported
            </Link>
          </li>
          <li>
            <Link to="/recently-added" className={location.pathname === '/recently-added' ? 'active' : ''}>
              <FiPlus />
              Recently Added
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
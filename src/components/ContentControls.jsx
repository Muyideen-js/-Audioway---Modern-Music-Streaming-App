import { useState } from 'react';
import { FiFilter, FiChevronRight, FiMusic, FiClock, FiStar, FiTrendingUp } from 'react-icons/fi';

function ContentControls() {
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('trending');

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setShowFilter(false);
  };

  return (
    <div className="content-controls">
      <div className="filter-controls">
        <div style={{ position: 'relative' }}>
          <button 
            className="filter-button"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FiFilter />
            Filter
          </button>
          
          <div className={`filter-dropdown ${showFilter ? 'active' : ''}`}>
            <div 
              className={`filter-option ${activeFilter === 'trending' ? 'active' : ''}`}
              onClick={() => handleFilterClick('trending')}
            >
              <FiTrendingUp />
              Trending Now
            </div>
            <div 
              className={`filter-option ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterClick('all')}
            >
              <FiMusic />
              All Tracks
            </div>
            <div 
              className={`filter-option ${activeFilter === 'recent' ? 'active' : ''}`}
              onClick={() => handleFilterClick('recent')}
            >
              <FiClock />
              Recently Added
            </div>
            <div 
              className={`filter-option ${activeFilter === 'popular' ? 'active' : ''}`}
              onClick={() => handleFilterClick('popular')}
            >
              <FiStar />
              Most Popular
            </div>
          </div>
        </div>
      </div>

      <button className="see-all-button">
        See All
        <FiChevronRight />
      </button>
    </div>
  );
}

export default ContentControls; 
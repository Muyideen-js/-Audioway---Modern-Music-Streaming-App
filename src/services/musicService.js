import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();

export const getToken = () => localStorage.getItem('spotify_token');

export const setSpotifyAccessToken = (token) => {
  if (token) {
    localStorage.setItem('spotify_token', token);
    spotify.setAccessToken(token);
    return true;
  }
  return false;
};

export async function initializeSpotify() {
  // Get token from URL hash
  const hash = window.location.hash;
  let token = getToken();

  if (!token && hash) {
    // Extract token from URL hash
    token = hash
      .substring(1)
      .split('&')
      .find(elem => elem.startsWith('access_token'))
      ?.split('=')[1];

    if (token) {
      return setSpotifyAccessToken(token);
    }
  } else if (token) {
    return setSpotifyAccessToken(token);
  }
  
  return false;
}

export async function fetchTrendingTracks() {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No access token available');
    }

    spotify.setAccessToken(token);
    
    // Try a simple search for popular tracks
    const searchResults = await spotify.searchTracks('genre:pop', {
      limit: 50,
      market: 'US'
    });

    console.log('Raw search results:', searchResults);

    if (!searchResults?.tracks?.items) {
      throw new Error('Invalid response from Spotify');
    }

    // First, just map all tracks
    const allTracks = searchResults.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      coverImage: track.album.images[0].url,
      previewUrl: track.preview_url || null
    }));

    console.log('All tracks before filtering:', allTracks);

    // Then filter with detailed logging
    const tracksWithPreviews = allTracks.filter(track => {
      const hasPreview = Boolean(track.previewUrl);
      console.log(`Track "${track.title}":`, {
        hasPreview,
        previewUrl: track.previewUrl,
        rawPreviewUrl: searchResults.tracks.items.find(t => t.id === track.id)?.preview_url
      });
      return hasPreview;
    });

    console.log('Tracks with previews:', tracksWithPreviews);

    // Return all tracks for now to debug
    return allTracks;

  } catch (error) {
    console.error('Error fetching tracks:', error);
    if (error.status === 401) {
      localStorage.removeItem('spotify_token');
      window.location.href = '/login';
      return [];
    }
    if (error.status === 429) {
      console.log('Rate limited by Spotify, waiting before retrying...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return fetchTrendingTracks();
    }
    throw error;
  }
}

export async function searchTracks(query) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No access token available');
    }

    spotify.setAccessToken(token);
    
    const searchResults = await spotify.searchTracks(query, {
      limit: 50,
      market: 'US'
    });

    if (!searchResults?.tracks?.items) {
      return [];
    }

    return searchResults.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      coverImage: track.album.images[0]?.url,
      previewUrl: track.preview_url,
      album: track.album.name,
      duration: track.duration_ms,
      artistId: track.artists[0].id
    }));

  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Add this new function to check token validity
export async function checkTokenValidity() {
  try {
    const token = getToken();
    if (!token) return false;

    spotify.setAccessToken(token);
    await spotify.getMe(); // Simple API call to check if token is valid
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    localStorage.removeItem('spotify_token');
    return false;
  }
}
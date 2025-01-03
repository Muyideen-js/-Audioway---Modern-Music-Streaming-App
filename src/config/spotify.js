export const spotifyConfig = {
    clientId: '5cf68547198d4766a16cc97c9c17a03f',
    redirectUri: `${window.location.origin}/callback`,
  scopes: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-top-read',
    'user-read-recently-played'
  ]
}; 
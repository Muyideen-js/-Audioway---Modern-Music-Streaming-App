import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('spotify_token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute; 
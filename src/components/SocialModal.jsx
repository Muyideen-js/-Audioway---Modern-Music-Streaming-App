import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaTimes } from 'react-icons/fa';
import './SocialModal.css';

function SocialModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="social-modal">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <h2>Follow My Socials</h2>
        
        <div className="social-links">
          <a 
            href="https://www.facebook.com/yusuf.muyideen.528" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link facebook"
          >
            <FaFacebook />
            <span>Facebook</span>
          </a>
          
          <a 
            href="https://x.com/abolax_123" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link twitter"
          >
            <FaTwitter />
            <span>Twitter</span>
          </a>
          
          <a 
            href="https://www.instagram.com/muyideen.jsx/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link instagram"
          >
            <FaInstagram />
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default SocialModal; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="modern-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            👨‍🍳 CookBook
          </Link>
          
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/create" className="nav-link">Add Recipe</Link>
                </li>
                <li>
                  <span className="nav-link" style={{
                    color: 'var(--primary-color)',
                    fontWeight: '600',
                    background: 'var(--bg-cream)'
                  }}>
                    👨‍🍳 {user.username}
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="nav-link"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Navbar;

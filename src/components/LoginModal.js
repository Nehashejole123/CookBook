import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { demoLogin } = useAuth();
  const [username, setUsername] = useState('');

  const handleDemoLogin = () => {
    demoLogin();
    onClose();
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      const customUser = {
        id: Date.now().toString(),
        username: username.trim(),
        email: `${username.toLowerCase()}@cookbook.com`
      };
      const { login } = useAuth();
      login(customUser);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(44, 62, 80, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeInUp 0.3s ease-out'
    }}>
      <div className="modern-card" style={{ 
        maxWidth: '440px', 
        width: '90%',
        position: 'relative',
        margin: '2rem'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--bg-light)',
            border: '2px solid #e1e8ed',
            borderRadius: 'var(--border-radius-small)',
            padding: '0.5rem',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.3s ease',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--danger-color)';
            e.target.style.color = 'white';
            e.target.style.borderColor = 'var(--danger-color)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--bg-light)';
            e.target.style.color = 'var(--text-secondary)';
            e.target.style.borderColor = '#e1e8ed';
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👨‍🍳</div>
          <h2 className="modern-subtitle">Welcome to CookBook!</h2>
          <p className="modern-text" style={{ fontSize: '1.1rem' }}>
            Choose how you'd like to join our culinary community:
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={handleDemoLogin}
            className="modern-btn modern-btn-secondary"
            style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center', fontSize: '1rem' }}
          >
            <span>🚀</span>
            Quick Start (Demo Chef)
          </button>
          
          <div style={{ 
            textAlign: 'center', 
            margin: '2rem 0',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: '#e1e8ed',
              zIndex: 1
            }}></div>
            <span style={{
              background: 'var(--bg-white)',
              padding: '0 1rem',
              color: 'var(--text-light)',
              fontSize: '0.875rem',
              position: 'relative',
              zIndex: 2
            }}>
              or create custom profile
            </span>
          </div>

          <form onSubmit={handleCustomLogin} className="modern-form" style={{ padding: '1.5rem', margin: 0 }}>
            <div className="form-group">
              <label className="form-label">Create Your Chef Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., MasterChef123"
                className="modern-input"
                maxLength="20"
              />
            </div>
            <button 
              type="submit"
              className="modern-btn modern-btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}
              disabled={!username.trim()}
            >
              <span>👨‍🍳</span>
              Create Chef Profile
            </button>
          </form>
        </div>

        <div style={{
          background: 'var(--bg-cream)',
          border: '1px solid rgba(231, 126, 34, 0.2)',
          borderRadius: 'var(--border-radius-small)',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div className="modern-text" style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-light)'
          }}>
            💡 This is a demo app - no real registration required!
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
